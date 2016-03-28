var bencode = module.exports

bencode.encode = require( './lib/encode' )
bencode.decode = require( './lib/decode' )

/**
 * Determines the amount of bytes
 * needed to encode the given value
 * @param  {Object|Array|Buffer|String|Number|Boolean} value
 * @return {Number} byteCount
 */
bencode.byteLength = bencode.encodingLength = function( value ) {
  return bencode.encode( value ).length
}
