/**
 * Dictionary constructor
 * @return {Dict}
 */
function Dict() {
  if( !(this instanceof Dict) )
    return new Dict()
}

/**
 * Dictionary key encoding.
 * It is strongly recommended to
 * choose a binary safe encoding,
 * to support binary keys in bencoded data.
 * @type {String}
 */
Dict.ENCODING = 'base64'

/**
 * Normalizes a key of any type to a Buffer.
 * @param  {Mixed}  value
 * @return {Buffer}
 */
function toKeyBuffer( value ) {
  // Make sure we have a string at hand,
  // to avoid creating corrupted buffers
  var key = typeof value === 'number' ?
    value.toString( 10 ) : value
  // Turn the key into a buffer in order
  // to make encoding matches happen
  return key instanceof Buffer ?
    key : new Buffer( key )
}

/**
 * Dictionary prototype
 * @type {Object}
 */
Dict.prototype = {
  
  constructor: Dict,
  
  keys: function() {
    return Object.keys( this )
      .map( function( k ) {
        return Buffer( k, Dict.ENCODING )
      })
  },
  
  has: function( key ) {
    var buffer = toKeyBuffer( key )
    return this.hasOwnProperty(
      buffer.toString( Dict.ENCODING )
    )
  },
  
  get: function( key ) {
    var buffer = toKeyBuffer( key )
    return this[ buffer.toString( Dict.ENCODING ) ]
  },
  
  set: function( key, value ) {
    var buffer = toKeyBuffer( key )
    return this[ buffer.toString( Dict.ENCODING ) ] = value
  },
  
}

// Exports
module.exports = Dict
