import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Bench } from 'tinybench'

import bencode from '../index.js'

import bencoding from 'bencoding'
import bncode from 'bncode'
import dht from 'dht.js/lib/dht/bencode.js'
import dhtBencode from 'dht-bencode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const object = bencode.decode(buffer)

const ITERATIONS = 10000

const bench = new Bench({ time: 100 })

bench.add(`bencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(object)
  }
  run.end()

  return result
})

bench.add(`bencoding.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencoding.encode(object)
  }
  run.end()

  return result
})

bench.add(`bncode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bncode.encode(object)
  }
  run.end()

  return result
})

bench.add(`dht.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dht.encode(object)
  }
  run.end()

  return result
})

bench.add(`dhtBencode.encode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bencode(object)
  }
  run.end()

  return result
})

await bench.run()

console.table(bench.table())
