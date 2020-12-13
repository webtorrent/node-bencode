var { digitCount, getType } = require('./util')

function listLength (list) {
  var length = 1 + 1 // type marker + end-of-type marker

  for (let value of list) {
    length += encodingLength(value)
  }

  return length
}

function mapLength (map) {
  var length = 1 + 1 // type marker + end-of-type marker

  for (let [ key, value ] of map) {
    let keyLength = Buffer.byteLength(key)
    length += digitCount(keyLength) + 1 + keyLength
    length += encodingLength(value)
  }

  return length
}

function objectLength (value) {
  var length = 1 + 1 // type marker + end-of-type marker
  var keys = Object.keys(value)

  for (var i = 0; i < keys.length; i++) {
    let keyLength = Buffer.byteLength(keys[i])
    length += digitCount(keyLength) + 1 + keyLength
    length += encodingLength(value[ keys[i] ])
  }

  return length
}

function stringLength (value) {
  var length = Buffer.byteLength(value)
  return digitCount(length) + 1 + length
}

function arrayBufferLength (value) {
  var length = value.byteLength - value.byteOffset
  return digitCount(length) + 1 + length
}

function encodingLength (value) {
  var length = 0

  if (value == null) return length

  var type = getType(value)

  switch (type) {
    case 'buffer': return digitCount(value.length) + 1 + value.length
    case 'arraybufferview': return arrayBufferLength(value)
    case 'string': return stringLength(value)
    case 'array': case 'set': return listLength(value)
    case 'number': return 1 + digitCount(Math.floor(value)) + 1
    case 'bigint': return 1 + value.toString().length + 1
    case 'object': return objectLength(value)
    case 'map': return mapLength(value)
    default:
      throw new TypeError(`Unsupported value of type "${type}"`)
  }
}

module.exports = encodingLength
