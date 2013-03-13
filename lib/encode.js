
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
  for( var k in data ) {
    dict[i++] = encode( k )
    dict[i++] = encode( data[k] )
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

// Expose
exports.encode = encode
