'use strict'
var constants = require('./constants.json')

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
var string = require('./string')
var integer = require('./integer')
var list = require('./list')
var dictionary = require('./dictionary')

function getEncodeType (value) {
  if (Buffer.isBuffer(value)) {
    return string
  } else if (typeof value === 'number') {
    return integer
  } else if (Array.isArray(value)) {
    return list
  } else if (typeof value === 'object') {
    return dictionary
  } else {
    throw new TypeError('no encoding for ' + typeof value)
  }
}

function encode (value, buffer, offset) {
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  var type = getEncodeType(value)
  type.encode(value, buffer, offset)
  encode.bytes = type.encode.bytes
  return buffer
}

function getDecodeType (buffer, offset, end) {
  if (offset + 1 > end) throw new RangeError('not enough data for decode')
  switch (buffer[offset]) {
    case constants.integer.code:
      return integer
    case constants.list.code:
      return list
    case constants.dictionary.code:
      return dictionary
    default:
      return string
  }
}

function decode (buffer, offset, end) {
  if (!offset) offset = 0
  if (!end) end = buffer.length

  var type = getDecodeType(buffer, offset, end)
  var value = type.decode(buffer, offset, end)
  decode.bytes = type.decode.bytes
  return value
}

function encodingLength (value) {
  return getEncodeType(value).encodingLength(value)
}
