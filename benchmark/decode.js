/* global suite, bench */
var fs = require('fs')

var bencode = require('../')
var bencoding = require('bencoding')
var dht_bencode = require('dht-bencode')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')

var buffer = fs.readFileSync(__dirname + '/test.torrent')

suite('decode to buffer', () => {
  bench('bencode', () => bencode.decode(buffer))
  bench('bencoding', () => bencoding.decode(buffer))
  bench('dht_bencode', () => dht_bencode.bdecode(buffer))
  bench('bncode', () => bncode.decode(buffer))
  bench('dht', () => dht.decode(buffer))
})
