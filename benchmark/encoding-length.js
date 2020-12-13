const fs = require('fs')
const path = require('path')
const bencode = require('..')
const bench = require('nanobench')

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const torrent = bencode.decode(buffer)

const ITERATIONS = 10000

bench('bencode.encodingLength(torrent)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(torrent)
  }
  run.end()

  return result
})

bench('bencode.encodingLength(buffer)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(buffer)
  }
  run.end()

  return result
})

bench('bencode.encodingLength(string)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength('Test, test, this is a string')
  }
  run.end()

  return result
})

bench('bencode.encodingLength(number)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength(87641234567)
  }
  run.end()

  return result
})

bench('bencode.encodingLength(array<number>)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  }
  run.end()

  return result
})

bench('bencode.encodingLength(small object)', function (run) {
  const result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    bencode.encodingLength({ a: 1, b: 'c', d: 'abcdefg', e: [1, 2, 3] })
  }
  run.end()

  return result
})
