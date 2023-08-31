import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bencode from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'test.torrent'))
const torrent = bencode.decode(buffer)

const ITERATIONS = 1

suite('encoding length', () => {
  scenario('bencode.encodingLength(torrent)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength(torrent)
    }

    return result
  })

  scenario('bencode.encodingLength(buffer)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength(buffer)
    }

    return result
  })

  scenario('bencode.encodingLength(string)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength('Test, test, this is a string')
    }

    return result
  })

  scenario('bencode.encodingLength(number)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength(87641234567)
    }

    return result
  })

  scenario('bencode.encodingLength(array<number>)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    }

    return result
  })

  scenario('bencode.encodingLength(small object)', function () {
    const result = null

    for (let i = 0; i < ITERATIONS; i++) {
      bencode.encodingLength({ a: 1, b: 'c', d: 'abcdefg', e: [1, 2, 3] })
    }

    return result
  })
})
