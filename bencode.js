
/**
 * Encodes data in bencode.
 *
 * @param  {Buffer|Array|String|Object|Number} data
 * @return {Buffer}
 */
function encode( data ) {

  if( data instanceof Buffer ) {
    return Buffer.concat([
      new Buffer(data.length+':'),
      data
    ])
  }

  switch( typeof data ) {
    case 'string':
      return encode.bytes( data )
      break
    case 'number':
      return encode.number( data )
      break
    case 'object':
      return data.constructor === Array
        ? encode.list( data )
        : encode.dict( data )
      break
  }

}

var buff_e = new Buffer('e')
  , buff_d = new Buffer('d')
  , buff_l = new Buffer('l')

encode.bytes = function( data ) {
  return Buffer.concat([
    new Buffer(Buffer.byteLength( data )+":"),
    new Buffer(data)
  ])
}

encode.number = function( data ) {
  return new Buffer('i' + data + 'e')
}

encode.dict = function( data ) {

  var dict = [ buff_d ]
  var i = 1;
  // fix for issue #13 - sorted dicts
  var keys = []
  for( var k in data) {
    keys.push(k)
  }
  keys = keys.sort()

  for(var j=0;j<keys.length;j++) {
    dict[i++] = encode( keys[j] )
    dict[i++] = encode( data[keys[j]] )
  }

  dict[i++] = buff_e
  return Buffer.concat(dict)

}

encode.list = function( data ) {

  var i = 0, j = 1
  var c = data.length
  var lst =  [ buff_l ]

  for( ; i < c; i++ ) {
    lst[j++] = encode( data[i] )
  }

  lst[j++] = buff_e
  return Buffer.concat(lst)

}

/**
 * Decodes bencoded data.
 *
 * @param  {Buffer} data
 * @param  {String} encoding
 * @return {Object|Array|Buffer|String|Number}
 */
function decode( data, encoding ) {

  decode.position = 0
  decode.encoding = encoding || null

  decode.data = !( data instanceof Buffer )
    ? new Buffer( data )
    : data

  return decode.next()

}

decode.position = 0
decode.data     = null
decode.encoding = null

decode.next = function() {

  switch( decode.data[decode.position] ) {
    case 0x64: return decode.dictionary(); break
    case 0x6C: return decode.list(); break
    case 0x69: return decode.integer(); break
    default:   return decode.bytes(); break
  }

}

decode.find = function( chr ) {

  var i = decode.position
  var c = decode.data.length
  var d = decode.data

  while( i < c ) {
    if( d[i] === chr )
      return i
    i++
  }

  return -1

}

decode.dictionary = function() {

  decode.position++

  var dict = {}

  while( decode.data[decode.position] !== 0x65 ) {
    dict[ decode.next() ] = decode.next()
  }

  decode.position++

  return dict

}

decode.list = function() {

  decode.position++

  var lst = []

  while( decode.data[decode.position] !== 0x65 ) {
    lst.push( decode.next() )
  }

  decode.position++

  return lst

}

decode.integer = function() {

  var end    = decode.find( 0x65 )
  var number = decode.data.slice( decode.position+1, end )

  decode.position += end + 1 - decode.position

  return +number

}

decode.bytes = function() {

  var sep    = decode.find( 0x3A )
  var length = +decode.data.slice( decode.position, sep ).toString()
  var sepl   = ++sep + length
  var bytes  = decode.data.slice( sep, sepl )

  decode.position += sepl - decode.position

  return decode.encoding
    ? bytes.toString( decode.encoding )
    : bytes

}

// Expose methods
exports.encode = encode
exports.decode = decode
