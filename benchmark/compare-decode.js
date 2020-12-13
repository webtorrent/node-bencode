const fs = require('fs')
const path = require('path')
const bench = require('nanobench')

const bencode = require('../')
const bencoding = require('bencoding')
const bncode = require('bncode')
const btparse = require('btparse')
const dht = require('dht.js/lib/dht/bencode')
const dhtBencode = require('dht-bencode')

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))

const ITERATIONS = 10000

bench(`bencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench(`bencoding.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencoding.decode(buffer)
  }
  run.end()

  return result
})

bench(`bncode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bncode.decode(buffer)
  }
  run.end()

  return result
})

bench(`btparse() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = btparse(buffer)
  }
  run.end()

  return result
})

bench(`dht.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dht.decode(buffer)
  }
  run.end()

  return result
})

bench(`dhtBencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bdecode(buffer)
  }
  run.end()

  return result
})
