import test from 'tape'
import data from './data.js'
import bencode from '../lib/index.js'

test('bencode#decode(x)', function (t) {
  t.test('should be able to decode an integer', function (t) {
    t.plan(2)
    t.equal(bencode.decode('i123e'), 123)
    t.equal(bencode.decode('i-123e'), -123)
  })
  t.test('should be throw an error when trying to decode a broken integer', function (t) {
    t.plan(2)
    t.throws(function () {
      bencode.decode('i12+3e')
    }, /not a number/)
    t.throws(function () {
      bencode.decode('i-1+23e')
    }, /not a number/)
  })
  t.test('should be able to decode a float (as int)', function (t) {
    t.plan(2)
    t.equal(bencode.decode('i12.3e'), 12)
    t.equal(bencode.decode('i-12.3e'), -12)
  })
  t.test('should be throw an error when trying to decode a broken float', function (t) {
    t.plan(2)
    t.throws(function () {
      bencode.decode('i1+2.3e')
    }, /not a number/)
    t.throws(function () {
      bencode.decode('i-1+2.3e')
    }, /not a number/)
  })

  t.test('should be able to decode a string', function (t) {
    t.plan(2)
    t.deepEqual(bencode.decode('5:asdfe'), new Uint8Array(Buffer.from('asdfe')))
    t.deepEqual(bencode.decode(data.binResultData.toString()), new Uint8Array(data.binStringData))
  })

  t.test('should be able to decode "binary keys"', function (t) {
    t.plan(1)
    t.ok(Object.prototype.hasOwnProperty.call(bencode.decode(data.binKeyData).files, data.binKeyName))
  })

  t.test('should be able to decode a dictionary', function (t) {
    t.plan(3)
    t.deepEqual(
      bencode.decode('d3:cow3:moo4:spam4:eggse'),
      {
        cow: new Uint8Array(Buffer.from('moo')),
        spam: new Uint8Array(Buffer.from('eggs'))
      }
    )
    t.deepEqual(
      bencode.decode('d4:spaml1:a1:bee'),
      {
        spam: [
          new Uint8Array(Buffer.from('a')),
          new Uint8Array(Buffer.from('b'))
        ]
      }
    )
    t.deepEqual(
      bencode.decode('d9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee'),
      {
        publisher: new Uint8Array(Buffer.from('bob')),
        'publisher-webpage': new Uint8Array(Buffer.from('www.example.com')),
        'publisher.location': new Uint8Array(Buffer.from('home'))
      }
    )
  })

  t.test('should be able to decode a list', function (t) {
    t.plan(1)
    t.deepEqual(
      bencode.decode('l4:spam4:eggse'),
      [new Uint8Array(Buffer.from('spam')),
        new Uint8Array(Buffer.from('eggs'))]
    )
  })
  t.test('should return the correct type', function (t) {
    t.plan(1)
    t.ok(ArrayBuffer.isView(bencode.decode('4:öö')))
  })
  t.test('should be able to decode stuff in dicts (issue #12)', function (t) {
    t.plan(4)
    const someData = {
      string: 'Hello World',
      integer: 12345,
      dict: {
        key: 'This is a string within a dictionary'
      },
      list: [1, 2, 3, 4, 'string', 5, {}]
    }
    const result = bencode.encode(someData)
    const dat = bencode.decode(result)
    t.equal(dat.integer, 12345)
    t.deepEqual(dat.string, new Uint8Array(Buffer.from('Hello World')))
    t.deepEqual(dat.dict.key, new Uint8Array(Buffer.from('This is a string within a dictionary')))
    t.deepEqual(dat.list, [1, 2, 3, 4, new Uint8Array(Buffer.from('string')), 5, {}])
  })
})
