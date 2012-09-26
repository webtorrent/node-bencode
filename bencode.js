
/**
 * Encodes data in bencode.
 * 
 * @param  {Buffer|Array|String|Object|Number} data
 * @return {String}
 */
function encode( data ) {
  
  if( Buffer.isBuffer( data ) )
    return encode.bytes( data )
  
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

encode.bytes = function( data ) {
  return data.length + ':' + data
}

encode.number = function( data ) {
  return 'i' + data + 'e'
}

encode.dict = function( data ) {
  
  var dict = 'd'
  
  for( var k in data ) {
    dict += encode( k ) + encode( data[k] )
  }
  
  return dict + 'e'
  
}

encode.list = function( data ) {
  
  var i = 0
  var c = data.length
  var lst = 'l'
  
  for( ; i < c; i++ ) {
    lst += encode( data[i] )
  }
  
  return lst + 'e'
  
}

/**
 * Decodes bencoded data.
 * 
 * @param  {Buffer} data
 * @param  {String} encoding
 * @return {Object|Array|Buffer|String|Number}
 */
function decode( data, encoding ) {
  
  decode.encoding = encoding || null
  
  decode.data = !( data instanceof Buffer )
    ? new Buffer( data )
    : data
  
  return decode.next()
  
}

decode.encoding = null
decode.data = null

decode.next = function() {
  
  switch( decode.data[0] ) {
    case 0x64: return decode.dictionary()
    case 0x6C: return decode.list()
    case 0x69: return decode.integer()
    default:   return decode.bytes()
  }
  
}

decode.find = function( chr ) {
  
  var i = 0
  var c = decode.data.length
  var d = decode.data
  
  while( i < c ) {
    if( d[i] === chr )
      return i
    i++
  }
  
  return -1
  
}

decode.forward = function( index ) {
  decode.data = decode.data.slice(
    index, decode.data.length
  )
}

decode.dictionary = function() {
  
  decode.forward( 1 )
  
  var dict = {}
  
  while( decode.data[0] !== 0x65 ) {
    dict[ decode.next() ] = decode.next()
  }
  
  decode.forward( 1 )
  
  return dict
  
}

decode.list = function() {
  
  decode.forward( 1 )
  
  var lst = []
  
  while( decode.data[0] !== 0x65 ) {
    lst.push( decode.next() )
  }
  
  decode.forward( 1 )
  
  return lst
  
}

decode.integer = function() {
  
  var end    = decode.find( 0x65 )
  var number = decode.data.slice( 1, end )
  
  decode.forward( end + 1 )
  
  return +number
  
}

decode.bytes = function() {
  
  var sep    = decode.find( 0x3A )
  var length = +decode.data.slice( 0, sep ).toString()
  var sepl   = sep + 1 + length
  var bytes  = decode.data.slice( sep + 1, sepl )
  
  decode.forward( sepl )
  
  return decode.encoding
    ? bytes.toString( decode.encoding )
    : bytes
  
}


/**
 * Decodes bencoded data.
 * 
 * @param  {Buffer} data
 * @param  {String} encoding
 * @return {Object|Array|Buffer|String|Number}
 */
function decodev2( data, encoding ) {
  
  decodev2.encoding = encoding || null
  
  decodev2.data = !( data instanceof Buffer )
    ? new Buffer( data )
    : data
  decodev2.position = 0

  return decodev2.next()
  
}

decodev2.position = 0
decodev2.encoding = null
decodev2.data = null

decodev2.next = function() {
  
  switch( decodev2.data[this.position] ) {
    case 0x64: return decodev2.dictionary()
    case 0x6C: return decodev2.list()
    case 0x69: return decodev2.integer()
    default:   return decodev2.bytes()
  }
  
}

decodev2.find = function( chr ) {
  
  var i = this.position
  var c = decodev2.data.length
  var d = decodev2.data
  
  while( i < c ) {
    if( d[i] === chr )
      return i
    i++
  }
  
  return -1
  
}

decodev2.forward = function( index ) {
  this.position += index
}

decodev2.dictionary = function() {
  
  this.position++;
  
  var dict = {}
  
  while( decodev2.data[this.position] !== 0x65 ) {
    dict[ decodev2.next() ] = decodev2.next()
  }
  
  this.position++;
  
  return dict
  
}

decodev2.list = function() {
  
  this.position++;
  
  var lst = []
  
  while( decodev2.data[this.position] !== 0x65 ) {
    lst.push( decodev2.next() )
  }
  
  this.position++;
  
  return lst
  
}

decodev2.integer = function() {
  
  var end    = decodev2.find( 0x65 )
  var number = decodev2.data.slice( 1, end )
  
  decodev2.forward( end + 1 - this.position)
  
  return +number
  
}

decodev2.bytes = function() {
  
  var sep    = decodev2.find( 0x3A )
  var length = +decodev2.data.slice( this.position, sep ).toString()
  var sepl   = sep + 1 + length
  var bytes  = decodev2.data.slice( sep + 1, sepl )
  
  decodev2.forward( sepl - this.position)
  
  return decodev2.encoding
    ? bytes.toString( decodev2.encoding )
    : bytes
  
}

exports.decodev2 = decodev2
// Expose methods
exports.encode = encode
exports.decode = decode