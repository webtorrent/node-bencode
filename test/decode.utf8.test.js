const test = require('tape').test
const data = require('./data')
const bencode = require('../lib/index.js')

test("bencode#decode(x, 'uft8')", function (t) {
  t.test('should be able to decode an integer', function (t) {
    t.plan(2)
    t.equal(bencode.decode('i123e', 'utf8'), 123)
    t.equal(bencode.decode('i-123e', 'utf8'), -123)
  })
  t.test('should be throw an error when trying to decode a broken integer', function (t) {
    t.plan(2)
    t.throws(function () {
      bencode.decode('i12+3e', 'utf8')
    }, /not a number/)
    t.throws(function () {
      bencode.decode('i-1+23e', 'utf8')
    }, /not a number/)
  })
  t.test('should be able to decode a float (as int)', function (t) {
    t.plan(2)
    t.equal(bencode.decode('i12.3e', 'utf8'), 12)
    t.equal(bencode.decode('i-12.3e', 'utf8'), -12)
  })
  t.test('should be throw an error when trying to decode a broken float', function (t) {
    t.plan(2)
    t.throws(function () {
      bencode.decode('i1+2.3e', 'utf8')
    }, /not a number/)
    t.throws(function () {
      bencode.decode('i-1+2.3e', 'utf8')
    }, /not a number/)
  })
  t.test('should be able to decode a string', function (t) {
    t.plan(2)
    t.equal(bencode.decode('5:asdfe', 'utf8'), 'asdfe')
    t.deepEqual(bencode.decode(data.binResultData.toString(), 'utf8'), data.binStringData.toString())
  })
  t.test('should be able to decode "binary keys"', function (t) {
    t.plan(1)
    const decoded = bencode.decode(data.binKeyData, 'utf8')
    t.ok(Object.prototype.hasOwnProperty.call(decoded.files, data.binKeyName.toString('utf8')))
  })

  t.test('should be able to decode a dictionary', function (t) {
    t.plan(3)
    t.deepEqual(
      bencode.decode('d3:cow3:moo4:spam4:eggse', 'utf8'),
      {
        cow: 'moo',
        spam: 'eggs'
      }
    )
    t.deepEqual(
      bencode.decode('d4:spaml1:a1:bee', 'utf8'),
      { spam: ['a', 'b'] }
    )
    t.deepEqual(
      bencode.decode('d9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee', 'utf8'),
      {
        publisher: 'bob',
        'publisher-webpage': 'www.example.com',
        'publisher.location': 'home'
      }
    )
  })

  t.test('should be able to decode a list', function (t) {
    t.plan(1)
    t.deepEqual(
      bencode.decode('l4:spam4:eggse', 'utf8'),
      ['spam', 'eggs']
    )
  })
  t.test('should return the correct type', function (t) {
    t.plan(1)
    t.ok(typeof (bencode.decode('4:öö', 'utf8')) === 'string')
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
    const dat = bencode.decode(result, 'utf8')
    t.equal(dat.integer, 12345)
    t.deepEqual(dat.string, 'Hello World')
    t.deepEqual(dat.dict.key, 'This is a string within a dictionary')
    t.deepEqual(dat.list, [1, 2, 3, 4, 'string', 5, {}])
  })
})
