import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Bench } from 'tinybench'

import bencode from '../index.js'

import bencoding from 'bencoding'
import bncode from 'bncode'
import btparse from 'btparse'
import dht from 'dht.js/lib/dht/bencode.js'
import dhtBencode from 'dht-bencode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))

const ITERATIONS = 10000

const bench = new Bench({ time: 100 })

bench.add(`bencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`bencoding.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencoding.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`bncode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bncode.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`btparse() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = btparse(buffer)
  }
  run.end()

  return result
})

bench.add(`dht.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dht.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`dhtBencode.decode() ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = dhtBencode.bdecode(buffer)
  }
  run.end()

  return result
})

await bench.run()

console.table(bench.table())
