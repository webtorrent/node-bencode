var bencode = require('..')
var test = require('tape').test

test('Data with null values', function (t) {
  t.test('should return an empty value when encoding either null or undefined', function (t) {
    t.plan(2)
    t.deepEqual(bencode.encode(null), new Buffer(0))
    t.deepEqual(bencode.encode(undefined), new Buffer(0))
  })

  t.test('should return null when decoding an empty value', function (t) {
    t.plan(2)
    t.deepEqual(bencode.decode(new Buffer(0)), null)
    t.deepEqual(bencode.decode(''), null)
  })

  t.test('should omit null values when encoding', function (t) {
    var data = [ { empty: null }, { notset: undefined }, null, undefined, 0 ]
    var result = bencode.decode(bencode.encode(data))
    var expected = [ {}, {}, 0 ]
    t.plan(1)
    t.deepEqual(result, expected)
  })
})
