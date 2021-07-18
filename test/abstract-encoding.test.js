const test = require('tape').test
const bencode = require('../lib/index.js')

test('abstract encoding', function (t) {
  t.test('encodingLength( value )', function (t) {
    const input = { string: 'Hello World', integer: 12345 }
    const output = Buffer.from('d7:integeri12345e6:string11:Hello Worlde')
    t.plan(1)
    t.equal(bencode.encodingLength(input), output.length)
  })

  t.test('encode.bytes', function (t) {
    const output = bencode.encode({ string: 'Hello World', integer: 12345 })
    t.plan(1)
    t.equal(output.length, bencode.encode.bytes)
  })

  t.test('encode into an existing buffer', function (t) {
    const input = { string: 'Hello World', integer: 12345 }
    const output = Buffer.from('d7:integeri12345e6:string11:Hello Worlde')
    const target = Buffer.allocUnsafe(output.length)
    bencode.encode(input, target)
    t.plan(1)
    t.deepEqual(target, output)
  })

  t.test('encode into a buffer with an offset', function (t) {
    const input = { string: 'Hello World', integer: 12345 }
    const output = Buffer.from('d7:integeri12345e6:string11:Hello Worlde')
    const target = Buffer.allocUnsafe(64 + output.length) // Pad with 64 bytes
    const offset = 48
    bencode.encode(input, target, offset)
    t.plan(1)
    t.deepEqual(target.slice(offset, offset + output.length), output)
  })

  t.test('decode.bytes', function (t) {
    const input = Buffer.from('d7:integeri12345e6:string11:Hello Worlde')
    bencode.decode(input)
    t.plan(1)
    t.equal(bencode.decode.bytes, input.length)
  })

  t.test('decode from an offset', function (t) {
    const pad = '_______________________________'
    const input = Buffer.from(pad + 'd7:integeri12345e6:string11:Hello Worlde')
    const output = bencode.decode(input, pad.length, 'utf8')
    t.plan(1)
    t.deepEqual(output, { string: 'Hello World', integer: 12345 })
  })

  t.test('decode between an offset and end', function (t) {
    const pad = '_______________________________'
    const data = 'd7:integeri12345e6:string11:Hello Worlde'
    const input = Buffer.from(pad + data + pad)
    const output = bencode.decode(input, pad.length, pad.length + data.length, 'utf8')
    t.plan(1)
    t.deepEqual(output, { string: 'Hello World', integer: 12345 })
  })
})
