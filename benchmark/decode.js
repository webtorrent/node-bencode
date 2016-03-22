/* global suite, bench */
var fs = require('fs')
var path = require('path')

var bencode = require('../')
var bencoding = require('bencoding')
var dht_bencode = require('dht-bencode')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')

var buffer = fs.readFileSync(path.join(__dirname, 'Fedora-Live-MATE_Compiz-x86_64-23.torrent'))

suite('decode', () => {
  bench('bencode', () => bencode.decode(buffer))
  bench('bencoding', () => bencoding.decode(buffer))
  bench('dht_bencode', () => dht_bencode.bdecode(buffer))
  bench('bncode', () => bncode.decode(buffer))
  bench('dht', () => dht.decode(buffer))
})
