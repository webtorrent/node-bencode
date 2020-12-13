var fs = require('fs')
var path = require('path')
var bench = require('nanobench')

var bencode = require('../')
var bencoding = require('bencoding')
var bncode = require('bncode')
var dht = require('dht.js/lib/dht/bencode')
var dhtBencode = require('dht-bencode')

var buffer = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'test.torrent'))
var object = bencode.decode(buffer)

const ITERATIONS = 10000

bench(`bencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(object)
  }
  run.end()

  return result
})

bench(`bencoding.encode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencoding.encode(object)
  }
  run.end()

  return result
})

bench(`bncode.encode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bncode.encode(object)
  }
  run.end()

  return result
})

bench(`dht.encode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = dht.encode(object)
  }
  run.end()

  return result
})

bench(`dhtBencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bencode(object)
  }
  run.end()

  return result
})
