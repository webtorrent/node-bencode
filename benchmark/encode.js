/* global suite, bench */
var fs = require('fs')

var bencode = require('../')
var bencoding = require('bencoding')
var dht_bencode = require('dht-bencode')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')

var buffer = fs.readFileSync(__dirname + '/test.torrent')
var object = bencode.decode(buffer)

suite('encode', () => {
  bench('bencode', () => bencode.encode(object))
  bench('bencoding', () => bencoding.encode(object))
  bench('dht_bencode', () => dht_bencode.bencode(object))
  bench('bncode', () => bncode.encode(object))
  bench('dht', () => dht.encode(object))
})
