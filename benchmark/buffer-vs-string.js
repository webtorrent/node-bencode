/* global suite, bench */
var fs = require('fs')
var path = require('path')
var bencode = require('../')
var bench = require('nanobench')

var buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
var str = buffer.toString('ascii')

const ITERATIONS = 10000

bench(`decode buffer ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench(`decode string ⨉ ${ITERATIONS}`, function (run) {
  var result = null

  run.start()
  for (var i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(str)
  }
  run.end()

  return result
})
