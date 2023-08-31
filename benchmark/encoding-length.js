import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bencode from '../index.js'

import { Bench } from 'tinybench'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const torrent = bencode.decode(buffer)

const ITERATIONS = 10000

const bench = new Bench({ time: 100 })

bench.add('bencode.encodingLength(torrent)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(torrent)
  }
  run.end()

  return result
})

bench.add('bencode.encodingLength(buffer)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(buffer)
  }
  run.end()

  return result
})

bench.add('bencode.encodingLength(string)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength('Test, test, this is a string')
  }
  run.end()

  return result
})

bench.add('bencode.encodingLength(number)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(87641234567)
  }
  run.end()

  return result
})

bench.add('bencode.encodingLength(array<number>)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  }
  run.end()

  return result
})

bench.add('bencode.encodingLength(small object)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength({ a: 1, b: 'c', d: 'abcdefg', e: [1, 2, 3] })
  }
  run.end()

  return result
})

await bench.run()

console.table(bench.table())
