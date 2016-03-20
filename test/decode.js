var test = require('tape').test
var bencode = require('../lib/bencode')
var fixture = require('./fixture')

test('should be able to decode an integer', function (t) {
  t.same(bencode.decode(new Buffer('i123e')), 123)
  t.same(bencode.decode(new Buffer('i-123e')), -123)
  t.end()
})

test('should be able to decode a string', function (t) {
  t.same(bencode.decode(new Buffer('5:asdfe')), 'asdfe')
  t.same(bencode.decode(fixture.binResultData), fixture.binStringData.toString())
  t.end()
})

test('should be able to decode \'binary keys\'', function (t) {
  var decoded = bencode.decode(fixture.binKeyData)
  t.ok(decoded.files.hasOwnProperty(fixture.binKeyName.toString('utf8')))
  t.end()
})

test('should be able to decode a dictionary', function (t) {
  t.same(
    bencode.decode(new Buffer('d3:cow3:moo4:spam4:eggse')),
    { cow: 'moo', spam: 'eggs' }
  )

  t.same(
    bencode.decode(new Buffer('d4:spaml1:a1:bee')),
    { spam: [ 'a', 'b' ] }
  )

  t.same(
    bencode.decode(new Buffer('d9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee')),
    { 'publisher': 'bob', 'publisher-webpage': 'www.example.com', 'publisher.location': 'home' }
  )

  t.end()
})

test('should be able to decode a list', function (t) {
  t.same(bencode.decode(new Buffer('l4:spam4:eggse')), [ 'spam', 'eggs' ])
  t.end()
})

test('should return the correct type', function (t) {
  t.ok(typeof bencode.decode(new Buffer('4:öö')) === 'string')
  t.end()
})

test('should be able to decode stuff in dicts (issue #12)', function (t) {
  var expected = {
    string: 'Hello World',
    integer: 12345,
    list: [ 1, 2, 3, 4, 'string', 5, {} ],
    dict: { k: 'This is a string within a dictionary', l: [] }
  }
  var result = bencode.decode(bencode.encode(expected))
  t.same(result.string, 'Hello World')
  t.same(result.integer, 12345)
  t.same(result.list, [ 1, 2, 3, 4, 'string', 5, {} ])
  t.same(result.dict, { k: 'This is a string within a dictionary', l: [] })
  t.end()
})
