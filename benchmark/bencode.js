const fs = require('fs')
const path = require('path')
const bench = require('nanobench')

const bencode = require('../')

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const object = bencode.decode(buffer)
const objectUtf8 = bencode.decode(buffer, 'utf8')
const objectAscii = bencode.decode(buffer, 'ascii')
const objectBinary = bencode.decode(buffer, 'binary')

const ITERATIONS = 10000

bench(`bencode.encode() [buffer] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(object)
  }
  run.end()

  return result
})

bench(`bencode.encode() [utf8] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectUtf8)
  }
  run.end()

  return result
})

bench(`bencode.encode() [ascii] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectAscii)
  }
  run.end()

  return result
})

bench(`bencode.encode() [binary] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.encode(objectBinary)
  }
  run.end()

  return result
})

bench(`bencode.decode() [buffer] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer)
  }
  run.end()

  return result
})

bench(`bencode.decode() [utf8] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'utf8')
  }
  run.end()

  return result
})

bench(`bencode.decode() [ascii] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'ascii')
  }
  run.end()

  return result
})

bench(`bencode.decode() [binary] ⨉ ${ITERATIONS}`, function (run) {
  let result = null

  run.start()
  for (let i = 0; i < ITERATIONS; i++) {
    result = bencode.decode(buffer, 'binary')
  }
  run.end()

  return result
})
