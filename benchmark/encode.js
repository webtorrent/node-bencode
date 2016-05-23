var fs = require('fs')

var bencode = require('../')
var bencoding = require('bencoding')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')
var dhtBencode = require('dht-bencode')

var buffer = fs.readFileSync(__dirname + '/test.torrent')
var object = bencode.decode(buffer)
var objectUtf8 = bencode.decode(buffer, 'utf8')
var objectAscii = bencode.decode(buffer, 'ascii')
var objectBinary = bencode.decode(buffer, 'binary')

suite('encode buffer', function () {
  bench('bencode', function () {
    bencode.encode(object)
  })
  bench('bencoding', function () {
    bencoding.encode(object)
  })
  bench('dht-bencode', function () {
    dhtBencode.bencode(object)
  })
  bench('bncode', function () {
    bncode.encode(object)
  })
  bench('dht', function () {
    dht.encode(object)
  })
})

suite('encode utf8', function () {
  bench('bencode', function () {
    bencode.encode(objectUtf8)
  })
  bench('bencoding', function () {
    bencoding.encode(objectUtf8)
  })
  bench('dht-bencode', function () {
    dhtBencode.bencode(objectUtf8)
  })
  bench('bncode', function () {
    bncode.encode(objectUtf8)
  })
  bench('dht', function () {
    dht.encode(objectUtf8)
  })
})
suite('encode ascii', function () {
  bench('bencode', function () {
    bencode.encode(objectAscii)
  })
  bench('bencoding', function () {
    bencoding.encode(objectAscii)
  })
  bench('dht-bencode', function () {
    dhtBencode.bencode(objectAscii)
  })
  bench('bncode', function () {
    bncode.encode(objectAscii)
  })
  bench('dht', function () {
    dht.encode(objectAscii)
  })
})
suite('encode binary', function () {
  bench('bencode', function () {
    bencode.encode(objectBinary)
  })
  bench('bencoding', function () {
    bencoding.encode(objectBinary)
  })
  bench('dht-bencode', function () {
    dhtBencode.bencode(objectBinary)
  })
  bench('bncode', function () {
    bncode.encode(objectBinary)
  })
  bench('dht', function () {
    dht.encode(objectBinary)
  })
})
