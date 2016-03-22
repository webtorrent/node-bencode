'use strict'
var constants = require('./constants.json')
var bencode = require('./bencode')

function encode (value, buffer, offset) {
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  if (offset + 1 > buffer.length) throw new RangeError('destination buffer is too small')
  buffer[offset] = constants.list.code
  var _offset = value.reduce(function (offset, item) {
    bencode.encode(item, buffer, offset)
    return offset + bencode.encode.bytes
  }, offset + 1)
  if (_offset + 1 > buffer.length) throw new RangeError('destination buffer is too small')
  buffer[_offset++] = constants.stop.code
  encode.bytes = _offset - offset
  return buffer
}

function decode (buffer, offset, end) {
  if (!offset) offset = 0
  if (!end) end = buffer.length

  var value = []
  var _offset = offset + 1
  while (buffer[_offset] !== constants.stop.code) {
    value.push(bencode.decode(buffer, _offset, end))
    _offset += bencode.decode.bytes
  }
  decode.bytes = _offset - offset + 1
  return value
}

function encodingLength (value) {
  return value.reduce(function (total, item) {
    return total + bencode.encodingLength(item)
  }, 2)
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
