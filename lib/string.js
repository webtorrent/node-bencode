'use strict'
var constants = require('./constants.json')
var util = require('./util')

function encode (value, buffer, offset) {
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  var slength = new Buffer(value.length.toString())
  encode.bytes = slength.length + 1 + value.length
  if (offset + encode.bytes > buffer.length) throw new RangeError('destination buffer is too small')
  slength.copy(buffer, offset)
  buffer[offset + slength.length] = constants.colon.code
  value.copy(buffer, offset + slength.length + 1)
  return buffer
}

function decode (buffer, offset, end) {
  if (!offset) offset = 0
  if (!end) end = buffer.length

  var stop1 = util.findSymbolCode(buffer, offset, end, constants.colon.code)
  var vlength = parseInt(buffer.toString('ascii', offset, stop1), 10)
  var stop2 = stop1 + 1 + vlength
  if (stop2 > end) throw new RangeError('not enough data for decode')
  decode.bytes = stop2 - offset
  return buffer.slice(stop1 + 1, stop2)
}

function encodingLength (value) {
  var length = value.length
  return length.toString().length + 1 + length
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
