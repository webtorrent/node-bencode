import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Bench } from 'tinybench'

import bencode from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const object = bencode.decode(buffer)
const objectUtf8 = bencode.decode(buffer, 'utf8')
const objectAscii = bencode.decode(buffer, 'ascii')
const objectBinary = bencode.decode(buffer, 'binary')

const ITERATIONS = 10000

const bench = new Bench({ time: 100 })

bench.add(`bencode.encode() [buffer] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(object)
  }
  run.end()

  return result
})

bench.add(`bencode.encode() [utf8] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectUtf8)
  }
  run.end()

  return result
})

bench.add(`bencode.encode() [ascii] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectAscii)
  }
  run.end()

  return result
})

bench.add(`bencode.encode() [binary] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectBinary)
  }
  run.end()

  return result
})

bench.add(`bencode.decode() [buffer] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`bencode.decode() [utf8] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'utf8')
  }
  run.end()

  return result
})

bench.add(`bencode.decode() [ascii] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'ascii')
  }
  run.end()

  return result
})

bench.add(`bencode.decode() [binary] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'binary')
  }
  run.end()

  return result
})

await bench.run()

console.table(bench.table())
