import fs from 'fs'
import path from 'path'
import bench from 'nanobench'

import bencode from '../index.js'
import bencoding from 'bencoding'
import bncode from 'bncode'
import btparse from 'btparse'
import dht from 'dht.js/lib/dht/bencode'
import dhtBencode from 'dht-bencode'

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
