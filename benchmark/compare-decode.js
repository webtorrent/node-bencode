var fs = require('fs')
var path = require('path')
var bench = require('nanobench')

var bencode = require('../')
var bencoding = require('bencoding')
var bncode = require('bncode')
var btparse = require('btparse')
var dht = require('dht.js/lib/dht/bencode')
var dhtBencode = require('dht-bencode')

var buffer = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'test.torrent'))

const ITERATIONS = 10000

bench(`bencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench(`bencoding.decode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencoding.decode(buffer)
  }
  run.end()

  return result
})

bench(`bncode.decode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bncode.decode(buffer)
  }
  run.end()

  return result
})

bench(`btparse() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = btparse(buffer)
  }
  run.end()

  return result
})

bench(`dht.decode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = dht.decode(buffer)
  }
  run.end()

  return result
})

bench(`dhtBencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bdecode(buffer)
  }
  run.end()

  return result
})
