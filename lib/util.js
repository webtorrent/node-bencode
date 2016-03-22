'use strict'
exports.findSymbolCode = function (buffer, offset, end, code) {
  for (; offset <= end; ++offset) {
    if (buffer[offset] === code) return offset
  }

  throw new RangeError('invalid data: missing delimiter "' + String.fromCharCode(code) + '"')
}
