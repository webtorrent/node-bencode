import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import bencode from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'test.torrent'))
const object = bencode.decode(buffer)
const objectUtf8 = bencode.decode(buffer, 'utf8')
const objectAscii = bencode.decode(buffer, 'ascii')
const objectBinary = bencode.decode(buffer, 'binary')

const ITERATIONS = 1

suite('bencode', () => {
  scenario('bencode.encode() [buffer]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.encode(object)
    }

    return result
  })

  scenario('bencode.encode() [utf8]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.encode(objectUtf8)
    }

    return result
  })

  scenario('bencode.encode() [ascii]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.encode(objectAscii)
    }

    return result
  })

  scenario('bencode.encode() [binary]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.encode(objectBinary)
    }

    return result
  })

  scenario('bencode.decode() [buffer]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer)
    }

    return result
  })

  scenario('bencode.decode() [utf8]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer, 'utf8')
    }

    return result
  })

  scenario('bencode.decode() [ascii]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer, 'ascii')
    }

    return result
  })

  scenario('bencode.decode() [binary]', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer, 'binary')
    }

    return result
  })
})
