import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import bencode from '../index.js'

import bencoding from 'bencoding'
import bncode from 'bncode'
import dht from 'dht.js/lib/dht/bencode.js'
import dhtBencode from 'dht-bencode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))
const object = bencode.decode(buffer)

const ITERATIONS = 1

suite('compare encode', () => {
  scenario('bencode.encode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.encode(object)
    }

    return result
  })

  scenario('bencoding.encode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencoding.encode(object)
    }

    return result
  })

  scenario('bncode.encode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bncode.encode(object)
    }

    return result
  })

  scenario('dht.encode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = dht.encode(object)
    }

    return result
  })

  scenario('dhtBencode.encode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = dhtBencode.bencode(object)
    }

    return result
  })
})
