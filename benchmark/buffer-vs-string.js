/* global suite, bench */
var fs = require('fs')
var path = require('path')
var bencode = require('../')

var buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
var str = buffer.toString('ascii')

suite('buffer vs string', function () {
  bench('buffer', function () {
    bencode.decode(buffer)
  })
  bench('string', function () {
    bencode.decode(str)
  })
})
