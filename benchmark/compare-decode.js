import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import bencode from '../index.js'

import bencoding from 'bencoding'
import bncode from 'bncode'
import btparse from 'btparse'
import dht from 'dht.js/lib/dht/bencode.js'
import dhtBencode from 'dht-bencode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, 'test.torrent'))

const ITERATIONS = 1

suite('compare decode', () => {
  scenario('bencode.decode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer)
    }

    return result
  })

  scenario('bencoding.decode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencoding.decode(buffer)
    }

    return result
  })

  scenario('bncode.decode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bncode.decode(buffer)
    }

    return result
  })

  scenario('btparse()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = btparse(buffer)
    }

    return result
  })

  scenario('dht.decode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = dht.decode(buffer)
    }

    return result
  })

  scenario('dhtBencode.decode()', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = dhtBencode.bdecode(buffer)
    }

    return result
  })
})
