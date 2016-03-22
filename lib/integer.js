'use strict'
var constants = require('./constants.json')
var util = require('./util')

function encode (value, buffer, offset) {
  if (value % 1 !== 0) throw new TypeError('only `Integer` allowed, not `Float`')
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  var encoded = new Buffer(constants.integer.symbol + value + constants.stop.symbol)
  if (offset + encoded.length > buffer.length) throw new RangeError('destination buffer is too small')
  encoded.copy(buffer, offset)
  encode.bytes = encoded.length
  return buffer
}

function decode (buffer, offset, end) {
  if (!offset) offset = 0
  if (!end) end = buffer.length

  var stop = util.findSymbolCode(buffer, offset + 1, end, constants.stop.code)
  var evalue = buffer.toString('ascii', offset + 1, stop)
  var value = parseInt(evalue, 10)
  if (isNaN(value)) throw new TypeError('invalid integer')
  if (evalue % 1 !== 0) throw new TypeError('only `Integer` allowed, not `Float`')
  if (value.toString() !== evalue) {
    if (evalue === '-0') throw new TypeError('i-0e is invalid encoding')
    throw new TypeError('leading zeros are not allowed')
  }
  decode.bytes = stop - offset + 1
  return value
}

function encodingLength (value) {
  return value.toString().length + 2
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
