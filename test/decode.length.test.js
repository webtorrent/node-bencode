import test from 'tape'
import bencode from '../index.js'

test('bencode#decode#bytes', function (t) {
  t.test('bytes should be set to correct value for two separate bencoded elements', function (t) {
    t.plan(2)
    t.equal(bencode.decode('i123ei123e'), 123)
    t.equal(bencode.decode.bytes, 5)
  })
  t.test('bytes should be set to correct value when followed by random junk data', function (t) {
    t.plan(1)
    const someData = {
      string: 'Hello World',
      integer: 12345,
      dict: {
        key: 'This is a string within a dictionary'
      },
      list: [1, 2, 3, 4, 'string', 5, {}]
    }
    const result = bencode.encode(someData)
    bencode.decode(Buffer.from(result).toString() + 'RANDOM_JUNK_DATA')
    t.equal(bencode.decode.bytes, result.length)
  })
})
