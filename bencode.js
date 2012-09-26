
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
  
  if( !(this instanceof decode) ) {
    return new decode( data, encoding )
  }
  
  this.encoding = encoding || null
  
  this.data = !( data instanceof Buffer )
    ? new Buffer( data )
    : data
  
  return this.next()
  
}

decode.prototype = {
  
  next: function() {
    
    switch( this.data[0] ) {
      case 0x64: return this.dictionary()
      case 0x6C: return this.list()
      case 0x69: return this.integer()
      default:   return this.bytes()
    }
    
  },
  
  find: function( chr ) {
    
    var i = 0
    var c = this.data.length
    var d = this.data
    
    while( i < c ) {
      if( d[i] === chr )
        return i
      i++
    }
    
    return -1
    
  },
  
  forward: function( index ) {
    this.data = this.data.slice(
      index, this.data.length
    )
  },
  
  dictionary: function() {
    
    this.forward( 1 )
    
    var dict = {}
    
    while( this.data[0] !== 0x65 ) {
      dict[ this.next() ] = this.next()
    }
    
    this.forward( 1 )
    
    return dict
    
  },

  list: function() {
    
    this.forward( 1 )
    
    var lst = []
    
    while( this.data[0] !== 0x65 ) {
      lst.push( this.next() )
    }
    
    this.forward( 1 )
    
    return lst
    
  },

  integer: function() {
    
    var end    = this.find( 0x65 )
    var number = this.data.slice( 1, end )
    
    this.forward( end + 1 )
    
    return +number
    
  },

  bytes: function() {
    
    var sep    = this.find( 0x3A )
    var length = +this.data.slice( 0, sep ).toString()
    var sepl   = sep + 1 + length
    var bytes  = this.data.slice( sep + 1, sepl )
    
    this.forward( sepl )
    
    return this.encoding
      ? bytes.toString( this.encoding )
      : bytes
    
  }
  
}

// Expose methods
exports.encode = encode
exports.decode = decode
