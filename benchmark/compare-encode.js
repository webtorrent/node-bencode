import fs from 'fs'
import path from 'path'
import bench from 'nanobench'

import bencode from '../index.js'
import bencoding from 'bencoding'
import bncode from 'bncode'
import dht from 'dht.js/lib/dht/bencode'
import dhtBencode from 'dht-bencode'

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
