const bencode = module.exports

bencode.encode = require('./encode.js')
bencode.decode = require('./decode.js')

bencode.urlMode = function urlMode () {
  bencode.encode.STRING_DELIM = '-'
  bencode.decode.STRING_DELIM = 0x2D
}
bencode.normalMode = function urlMode () {
  bencode.encode.STRING_DELIM = ':'
  bencode.decode.STRING_DELIM = 0x3A
}

/**
 * Determines the amount of bytes
 * needed to encode the given value
 * @param  {Object|Array|Buffer|String|Number|Boolean} value
 * @return {Number} byteCount
 */
bencode.byteLength = bencode.encodingLength = require('./encoding-length.js')
