'use strict'
var constants = require('./constants.json')
var util = require('./util')

function encode (value, buffer, offset) {
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  var evalue = new Buffer(value)
  var elength = new Buffer(evalue.length.toString())
  var tlength = elength.length + 1 + evalue.length
  if (offset + tlength > buffer.length) throw new RangeError('destination buffer is too small')
  elength.copy(buffer, offset)
  buffer[offset + elength.length] = constants.colon.code
  evalue.copy(buffer, offset + elength.length + 1)
  encode.bytes = tlength
  return buffer
}

function decode (buffer, offset, end) {
  if (!offset) offset = 0
  if (!end) end = buffer.length

  var stop1 = util.findSymbolCode(buffer, offset, end, constants.colon.code)
  var vlength = parseInt(buffer.toString('ascii', offset, stop1), 10)
  var stop2 = stop1 + 1 + vlength
  if (stop2 > end) throw new RangeError('not enough data for decode')
  var bvalue = buffer.slice(stop1 + 1, stop2)
  decode.bytes = stop2 - offset
  return bvalue.toString()
}

function encodingLength (value) {
  var buffer = new Buffer(value)
  return buffer.length.toString().length + 1 + buffer.length
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
