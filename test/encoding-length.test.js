import fs from 'fs'
import path, { dirname } from 'path'
import test from 'tape'
import bencode from '../index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const torrent = fs.readFileSync(
  path.join(__dirname, '..', 'benchmark', 'test.torrent')
)

test('encoding-length', function (t) {
  t.test('torrent', function (t) {
    const value = bencode.decode(torrent)
    const length = bencode.encodingLength(value)
    t.plan(1)
    t.equal(length, torrent.length)
  })

  t.test('returns correct length for empty dictionaries', function (t) {
    t.plan(2)
    t.equal(bencode.encodingLength({}), 2) // de
    t.equal(bencode.encodingLength(new Map()), 2) // de
  })

  t.test('returns correct length for dictionaries', function (t) {
    t.plan(2)
    const obj = { a: 1, b: 'str', c: { de: 'f' } }
    const map = new Map([
      ['a', 1],
      ['b', 'str'],
      ['c', { de: 'f' }]
    ])
    t.equal(bencode.encodingLength(obj), 28) // d1:ai1e1:b3:str1:cd2:de1:fee
    t.equal(bencode.encodingLength(map), 28) // d1:ai1e1:b3:str1:cd2:de1:fee
  })

  t.test('returns correct length for ArrayBuffer views', function (t) {
    const buffer = new ArrayBuffer(32)
    const cases = [
      ['full view', new Uint8Array(buffer), 35],
      ['offset view with a two digit length', new Uint8Array(buffer, 2, 10), 13],
      ['offset larger than the view length', new Uint8Array(buffer, 20, 3), 5],
      ['empty offset view', new Uint8Array(buffer, 7, 0), 2],
      ['Uint16Array view', new Uint16Array(buffer, 8, 3), 8],
      ['Uint32Array view', new Uint32Array(buffer, 12, 3), 15],
      ['DataView', new DataView(buffer, 20, 3), 5],
      ['empty DataView', new DataView(buffer, 7, 0), 2],
      ['Buffer subarray', Buffer.from(buffer).subarray(20, 23), 5]
    ]

    t.plan(cases.length * 2)
    for (const [name, value, length] of cases) {
      t.equal(bencode.encodingLength(value), length, name)
      t.equal(bencode.byteLength(value), length, name + ' byteLength alias')
    }
  })

  t.test('returns correct length for nested offset views', function (t) {
    const value = new Uint8Array(new ArrayBuffer(32), 20, 3)
    t.plan(4)
    t.equal(bencode.encodingLength([value]), 7)
    t.equal(bencode.encodingLength(new Set([value])), 7)
    t.equal(bencode.encodingLength({ a: value }), 10)
    t.equal(bencode.encodingLength(new Map([['a', value]])), 10)
  })

  t.test('encodes into a buffer sized from an offset view', function (t) {
    const value = Uint8Array.from([0, 0, 1, 2, 3]).subarray(2)
    const target = new Uint8Array(bencode.encodingLength(value))
    t.plan(1)
    t.deepEqual(bencode.encode(value, target), Uint8Array.from([51, 58, 1, 2, 3]))
  })

  t.test('returns correct length for empty lists', function (t) {
    t.plan(2)
    t.equal(bencode.encodingLength([]), 2) // le
    t.equal(bencode.encodingLength(new Set()), 2) // le
  })

  t.test('returns correct length for lists', function (t) {
    t.plan(3)
    t.equal(bencode.encodingLength([1, 2, 3]), 11) // li1ei2ei3ee
    t.equal(bencode.encodingLength([1, 'string', [{ a: 1, b: 2 }]]), 29) // li1e6:stringld1:ai1e1:bi2eeee
    t.equal(bencode.encodingLength(new Set([1, 'string', [{ a: 1, b: 2 }]])), 29) // li1e6:stringld1:ai1e1:bi2eeee
  })

  t.test('returns correct length for integers', function (t) {
    t.plan(2)
    t.equal(bencode.encodingLength(-0), 3) // i0e
    t.equal(bencode.encodingLength(-1), 4) // i-1e
  })

  t.test('returns integer part length for floating point numbers', function (t) {
    t.plan(1)
    t.equal(bencode.encodingLength(100.25), 1 + 1 + 3)
  })

  t.test('returns correct length for BigInts', function (t) {
    t.plan(1)
    // 2n ** 128n == 340282366920938463463374607431768211456
    t.equal(bencode.encodingLength(340282366920938463463374607431768211456), 1 + 1 + 39)
  })

  t.test('returns zero for undefined or null values', function (t) {
    t.plan(2)
    t.equal(bencode.encodingLength(null), 0)
    t.equal(bencode.encodingLength(undefined), 0)
  })
})
