const test = require('tape').test
const bencode = require('../lib/index.js')

test('bencode#urlMode()', function (t) {
  bencode.encode._floatConversionDetected = true

  t.test('has the original STRING_DELIM', function (t) {
    t.plan(2)
    t.equal(bencode.encode.STRING_DELIM, ':')
    t.equal(bencode.decode.STRING_DELIM, 0x3A)
  })
  t.test('has the uri component compatible STRING_DELIM', function (t) {
    bencode.urlMode()
    t.plan(2)
    t.equal(bencode.encode.STRING_DELIM, '-')
    t.equal(bencode.decode.STRING_DELIM, 0x2D)
  })

  t.test('should encode and decode', function (t) {
    bencode.urlMode()
    const data = { foo: 'bar' }
    t.plan(2)
    t.equal(bencode.encode(data).toString(), 'd3-foo3-bare')
    t.deepEqual(bencode.decode('d3-foo3-bare', 'utf-8'), data)
  })

  t.test('restores the original STRING_DELIM', function (t) {
    t.plan(2)
    bencode.urlMode()
    bencode.normalMode()
    t.equal(bencode.encode.STRING_DELIM, ':')
    t.equal(bencode.decode.STRING_DELIM, 0x3A)
  })
})
