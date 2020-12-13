const fs = require('fs')
const path = require('path')
const bench = require('nanobench')

const bencode = require('../')
const bencoding = require('bencoding')
const bncode = require('bncode')
const dht = require('dht.js/lib/dht/bencode')
const dhtBencode = require('dht-bencode')

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const object = bencode.decode(buffer)

const ITERATIONS = 10000

bench(`bencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(object)
  }
  run.end()

  return result
})

bench(`bencoding.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencoding.encode(object)
  }
  run.end()

  return result
})

bench(`bncode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bncode.encode(object)
  }
  run.end()

  return result
})

bench(`dht.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dht.encode(object)
  }
  run.end()

  return result
})

bench(`dhtBencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bencode(object)
  }
  run.end()

  return result
})
