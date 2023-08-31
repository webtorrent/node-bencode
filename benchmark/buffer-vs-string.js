// suite and scenario are undefined
/* eslint-disable no-undef */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bencode from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buffer = fs.readFileSync(path.join(__dirname, '..', 'test', 'data', 'test.torrent'))
const str = buffer.toString('ascii')

const ITERATIONS = 1

suite('buffer vs string', () => {
  scenario('decode buffer', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(buffer)
    }

    return result
  })

  scenario('decode string', function () {
    let result = null

    for (let i = 0; i < ITERATIONS; i++) {
      result = bencode.decode(str)
    }

    return result
  })
})
