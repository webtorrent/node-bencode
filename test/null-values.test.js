import test from 'tape'
import bencode from '../lib/index.js'

test('Data with null values', function (t) {
  t.test('should return an empty value when encoding either null or undefined', function (t) {
    t.plan(2)
    t.deepEqual(bencode.encode(null), new Uint8Array())
    t.deepEqual(bencode.encode(undefined), new Uint8Array())
  })

  t.test('should return null when decoding an empty value', function (t) {
    t.plan(2)
    t.deepEqual(bencode.decode(Buffer.allocUnsafe(0)), null)
    t.deepEqual(bencode.decode(''), null)
  })

  t.test('should omit null values when encoding', function (t) {
    const data = [{ empty: null }, { notset: undefined }, null, undefined, 0]
    const result = bencode.decode(bencode.encode(data))
    const expected = [{}, {}, 0]
    t.plan(1)
    t.deepEqual(result, expected)
  })
})
