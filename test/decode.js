var test = require('tape').test
var bencode = require('../lib/bencode')
var fixture = require('./fixture')

test('should be able to decode an integer', function (t) {
  t.same(bencode.decode(new Buffer('i123e')), 123)
  t.same(bencode.decode(new Buffer('i-123e')), -123)
  t.end()
})

test('should be able to decode a string', function (t) {
  t.same(bencode.decode(new Buffer('5:asdfe')), new Buffer('asdfe', 'ascii'))
  t.same(bencode.decode(fixture.binResultData), fixture.binStringData)
  t.end()
})

test('should be able to decode \'binary keys\'', function (t) {
  var decoded = bencode.decode(fixture.binKeyData)
  t.ok(decoded.files.hasOwnProperty(fixture.binKeyName.toString('ascii')))
  t.end()
})

test('should be able to decode a dictionary', function (t) {
  t.same(
    bencode.decode(new Buffer('d3:cow3:moo4:spam4:eggse')),
    { cow: new Buffer('moo', 'ascii'), spam: new Buffer('eggs', 'ascii') }
  )

  t.same(
    bencode.decode(new Buffer('d4:spaml1:a1:bee')),
    { spam: [ new Buffer('a', 'ascii'), new Buffer('b', 'ascii') ] }
  )

  t.same(
    bencode.decode(new Buffer('d9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee')),
    {
      'publisher': new Buffer('bob', 'ascii'),
      'publisher-webpage': new Buffer('www.example.com', 'ascii'),
      'publisher.location': new Buffer('home', 'ascii')
    }
  )

  t.end()
})

test('should be able to decode a list', function (t) {
  var expected = [ new Buffer('spam', 'ascii'), new Buffer('eggs', 'ascii') ]
  t.same(bencode.decode(new Buffer('l4:spam4:eggse')), expected)
  t.end()
})

test('should return the correct type', function (t) {
  t.ok(Buffer.isBuffer(bencode.decode(new Buffer('4:öö'))))
  t.end()
})

test('should be able to decode stuff in dicts (issue #12)', function (t) {
  var expected = {
    string: new Buffer('Hello World', 'ascii'),
    integer: 12345,
    list: [ 1, 2, 3, 4, new Buffer('string', 'ascii'), 5, {} ],
    dict: { k: new Buffer('This is a string within a dictionary', 'ascii'), l: [] }
  }
  t.same(bencode.decode(bencode.encode(expected)), expected)
  t.end()
})
