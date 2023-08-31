import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bencode from '../index.js'

import { Bench } from 'tinybench'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const str = buffer.toString('ascii')

const ITERATIONS = 10000

const bench = new Bench({ time: 100 })

bench.add(`decode buffer ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench.add(`decode string ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(str)
  }
  run.end()

  return result
})

await bench.run()

console.table(bench.table())
