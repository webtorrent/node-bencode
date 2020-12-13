const fs = require('fs')
const path = require('path')
const bencode = require('../')
const bench = require('nanobench')

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const str = buffer.toString('ascii')

const ITERATIONS = 10000

bench(`decode buffer ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench(`decode string ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(str)
  }
  run.end()

  return result
})
