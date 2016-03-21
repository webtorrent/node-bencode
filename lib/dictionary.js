'use strict'
var constants = require('./constants.json')
var bencode = require('./bencode')
var string = require('./string')

function encode (value, buffer, offset) {
  if (!buffer) buffer = new Buffer(encodingLength(value))
  if (!offset) offset = 0

  if (offset + 1 > buffer.length) throw new RangeError('destination buffer is too small')
  buffer[offset] = constants.dictionary.code
  var _offset = Object.keys(value).sort().reduce(function (offset, key) {
    string.encode(new Buffer(key, 'ascii'), buffer, offset)
    offset += string.encode.bytes
    bencode.encode(value[key], buffer, offset)
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

  var value = {}
  var _offset = offset + 1
  while (buffer[_offset] !== constants.stop.code) {
    var key = string.decode(buffer, _offset, end).toString('ascii')
    _offset += string.decode.bytes
    value[key] = bencode.decode(buffer, _offset, end)
    _offset += bencode.decode.bytes
  }
  decode.bytes = _offset - offset + 1
  return value
}

function encodingLength (value) {
  return Object.keys(value).reduce(function (total, key) {
    return total + string.encodingLength(key) + bencode.encodingLength(value[key])
  }, 2)
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }
