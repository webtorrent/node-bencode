import test from 'tape'
import data from './data.js'
import bencode from '../index.js'
import { arr2text } from 'uint8-util'

test('bencode#encode()', function (t) {
  // prevent the warning showing up in the test
  bencode.encode._floatConversionDetected = true

  t.test('should always return a Buffer', function (t) {
    t.plan(5)
    t.ok(ArrayBuffer.isView(bencode.encode({})), 'its a buffer for empty dicts')
    t.ok(ArrayBuffer.isView(bencode.encode('test')), 'its a buffer for strings')
    t.ok(ArrayBuffer.isView(bencode.encode([3, 2])), 'its a buffer for lists')
    t.ok(ArrayBuffer.isView(bencode.encode({ a: 'b', 3: 6 })), 'its a buffer for big dicts')
    t.ok(ArrayBuffer.isView(bencode.encode(123)), 'its a buffer for numbers')
  })

  t.test('should sort dictionaries', function (t) {
    t.plan(1)
    const data = { string: 'Hello World', integer: 12345 }
    t.equal(Buffer.from(bencode.encode(data)).toString(), 'd7:integeri12345e6:string11:Hello Worlde')
  })

  t.test('should force keys to be strings', function (t) {
    t.plan(1)
    const data = {
      12: 'Hello World',
      34: 12345
    }
    t.equal(Buffer.from(bencode.encode(data)).toString(), 'd2:1211:Hello World2:34i12345ee')
  })

  t.test('should encode a Map as dictionary', function (t) {
    t.plan(1)
    const data = new Map([
      [12, 'Hello World'],
      ['34', 12345],
      [Buffer.from('buffer key'), Buffer.from('buffer value')]
    ])
    t.equal(Buffer.from(bencode.encode(data)).toString(), 'd2:1211:Hello World2:34i12345e10:buffer key12:buffer valuee')
  })

  t.test('should be able to encode a positive integer', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(123)).toString(), 'i123e')
  })
  t.test('should be able to encode a negative integer', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(-123)).toString(), 'i-123e')
  })
  t.test('should be able to encode a positive float (as int)', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(123.5)).toString(), 'i123e')
  })
  t.test('should be able to encode a negative float (as int)', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(-123.5)).toString(), 'i-123e')
  })

  t.test('should be able to safely encode numbers between -/+ 2 ^ 53 (as ints)', function (t) {
    const JAVASCRIPT_INT_BITS = 53
    const MAX_JAVASCRIPT_INT = Math.pow(2, JAVASCRIPT_INT_BITS)

    t.plan((JAVASCRIPT_INT_BITS - 1) * 6 + 3)
    t.equal(Buffer.from(bencode.encode(0)).toString(), 'i' + 0 + 'e')

    for (let exp = 1; exp < JAVASCRIPT_INT_BITS; ++exp) {
      const val = Math.pow(2, exp)
      // try the positive and negative
      t.equal(Buffer.from(bencode.encode(val)).toString(), 'i' + val + 'e')
      t.equal(Buffer.from(bencode.encode(-val)).toString(), 'i-' + val + 'e')

      // try the value, one above and one below, both positive and negative
      const above = val + 1
      const below = val - 1

      t.equal(Buffer.from(bencode.encode(above)).toString(), 'i' + above + 'e')
      t.equal(Buffer.from(bencode.encode(-above)).toString(), 'i-' + above + 'e')

      t.equal(Buffer.from(bencode.encode(below)).toString(), 'i' + below + 'e')
      t.equal(Buffer.from(bencode.encode(-below)).toString(), 'i-' + below + 'e')
    }
    t.equal(Buffer.from(bencode.encode(MAX_JAVASCRIPT_INT)).toString(), 'i' + MAX_JAVASCRIPT_INT + 'e')
    t.equal(Buffer.from(bencode.encode(-MAX_JAVASCRIPT_INT)).toString(), 'i-' + MAX_JAVASCRIPT_INT + 'e')
  })
  t.test('should be able to encode a previously problematice 64 bit int', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(2433088826)).toString(), 'i' + 2433088826 + 'e')
  })
  t.test('should be able to encode a negative 64 bit int', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(-0xffffffff)).toString(), 'i-' + 0xffffffff + 'e')
  })
  t.test('should be able to encode a positive 64 bit float (as int)', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(0xffffffff + 0.5)).toString(), 'i' + 0xffffffff + 'e')
  })
  t.test('should be able to encode a negative 64 bit float (as int)', function (t) {
    t.plan(1)
    t.equal(Buffer.from(bencode.encode(-0xffffffff - 0.5)).toString(), 'i-' + 0xffffffff + 'e')
  })
  t.test('should be able to encode a string', function (t) {
    t.plan(2)
    t.equal(Buffer.from(bencode.encode('asdf')).toString(), '4:asdf')
    t.equal(Buffer.from(bencode.encode(':asdf:')).toString(), '6::asdf:')
  })
  t.test('should be able to encode a unicode string', function (t) {
    t.plan(2)
    t.deepEqual(bencode.encode(data.binStringData.toString()), new Uint8Array(data.binResultData))
    t.deepEqual(bencode.encode(data.binStringData.toString()), new Uint8Array(data.binResultData))
  })
  t.test('should be able to encode a buffer', function (t) {
    t.plan(2)
    t.equal(Buffer.from(bencode.encode(Buffer.from('asdf'))).toString(), '4:asdf')
    t.equal(Buffer.from(bencode.encode(Buffer.from(':asdf:'))).toString(), '6::asdf:')
  })
  t.test('should be able to encode an array', function (t) {
    t.plan(2)
    t.equal(Buffer.from(bencode.encode([32, 12])).toString(), 'li32ei12ee')
    t.equal(Buffer.from(bencode.encode([':asdf:'])).toString(), 'l6::asdf:e')
  })
  t.test('should be able to encode a Set as a list', function (t) {
    t.plan(2)
    t.equal(Buffer.from(bencode.encode(new Set([32, 12]))).toString(), 'li32ei12ee')
    t.equal(Buffer.from(bencode.encode(new Set([':asdf:']))).toString(), 'l6::asdf:e')
  })
  t.test('should be able to encode an object', function (t) {
    t.plan(3)
    t.equal(Buffer.from(bencode.encode({ a: 'bc' })).toString(), 'd1:a2:bce')
    t.equal(Buffer.from(bencode.encode({ a: '45', b: 45 })).toString(), 'd1:a2:451:bi45ee')
    t.equal(Buffer.from(bencode.encode({ a: Buffer.from('bc') })).toString(), 'd1:a2:bce')
  })

  t.test('should encode new Number(1) as number', function (t) {
    var data = new Number(1) // eslint-disable-line
    const result = bencode.decode(bencode.encode(data))
    const expected = 1
    t.plan(1)
    t.strictEqual(result, expected)
  })

  t.test('should encode new Boolean(true) as number', function (t) {
    var data = new Boolean(true) // eslint-disable-line
    const result = bencode.decode(bencode.encode(data))
    const expected = 1
    t.plan(1)
    t.strictEqual(result, expected)
  })

  t.test('should encode Uint8Array as buffer', function (t) {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const result = bencode.decode(bencode.encode(data))
    const expected = new Uint8Array(data.buffer)
    t.plan(1)
    t.deepEqual(result, expected)
  })

  t.test('should encode Uint32Array as buffer', function (t) {
    const data = new Uint32Array([0xF, 0xFF, 0xFFF, 0xFFFF, 0xFFFFF, 0xFFFFFF, 0xFFFFFFF, 0xFFFFFFFF])
    const result = bencode.decode(bencode.encode(data))
    const expected = new Uint8Array(data.buffer)
    t.plan(1)
    t.deepEqual(result, expected)
  })

  t.test('should encode ArrayBuffer as buffer', function (t) {
    const data = new Uint32Array([0xF, 0xFF, 0xFFF, 0xFFFF, 0xFFFFF, 0xFFFFFF, 0xFFFFFFF, 0xFFFFFFFF])
    const result = bencode.decode(bencode.encode(data.buffer))
    const expected = new Uint8Array(data.buffer)
    t.plan(1)
    t.deepEqual(result, expected)
  })

  t.test('should encode Float32Array as buffer', function (t) {
    const data = new Float32Array([1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.0])
    const result = bencode.decode(bencode.encode(data))
    const expected = new Uint8Array(data.buffer)
    t.plan(1)
    t.deepEqual(result, expected)
  })

  t.test('should encode DataView as buffer', function (t) {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const view = new DataView(data.buffer)
    const result = bencode.decode(bencode.encode(view))
    const expected = new Uint8Array(data.buffer)
    t.plan(1)
    t.deepEqual(result, expected)
  })

  t.test('should encode Uint8Array subarray properly', function (t) {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const subData = data.subarray(5)
    const result = bencode.decode(bencode.encode(subData))
    const expected = new Uint8Array(subData.buffer, subData.byteOffset, subData.byteLength)
    t.plan(1)
    t.deepEqual(result, expected)
  })
  t.test('should encode large numbers with full digits', function (t) {
    t.plan(1)
    const data = 340282366920938463463374607431768211456
    t.deepEqual(arr2text(bencode.encode(data)), 'i340282366920938463463374607431768211456e')
  })
})
