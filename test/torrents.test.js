import fs from 'fs'
import path from 'path'
import test from 'tape'
import { fileURLToPath } from 'url'

import bencode from '../index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function isEqualArray (a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

function hexdump (buffer) {
  // https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
  const stringOfByte = (
    [
      '\\x00', '\\x01', '\\x02', '\\x03', '\\x04', '\\x05', '\\x06', '\\x07', '\\x08', '\\t', '\\n',
      '\\x0b', '\\x0c', '\\r', '\\x0e', '\\x0f', '\\x10', '\\x11', '\\x12', '\\x13', '\\x14', '\\x15',
      '\\x16', '\\x17', '\\x18', '\\x19', '\\x1a', '\\x1b', '\\x1c', '\\x1d', '\\x1e', '\\x1f', ' ',
      '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3',
      '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F',
      'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
      'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', '\\x7f'
    ].concat(
      Array(256).fill('00').map((_, n) => n).slice(128).map(n => '\\x' + n.toString(16).padStart(2, '0'))
    )
  ).map((s, i) => i.toString(16).padStart(2, '0') + (s.startsWith('\\x') ? '' : (' = ' + s)) + '\n')
  return Array.from(buffer).map(i => stringOfByte[i]).join('')
}

function testDecodeEncodeFile (t, fileName) {
  t.test(`should decode and encode file: ${fileName}`, function (t) {
    t.plan(1)
    const encodedExpected = fs.readFileSync(path.join(__dirname, 'data', fileName))
    const decoded = bencode.decode(encodedExpected)
    const encodedActual = bencode.encode(decoded)
    const isEqual = isEqualArray(encodedExpected, encodedActual)
    t.equal(isEqual, true)
    if (!isEqual) {
      console.error(`writing actual torrent to test/data/${fileName}.actual`)
      const actualPath = path.join(__dirname, 'data', fileName + '.actual')
      fs.writeFileSync(actualPath, encodedActual, 'binary')
      console.error(`writing actual torrent hexdump to test/data/${fileName}.actual.txt`)
      const actualHexdumpPath = path.join(__dirname, 'data', fileName + '.actual.txt')
      fs.writeFileSync(actualHexdumpPath, hexdump(encodedActual), 'ascii')
    }
  })
}

test('Torrent test files', function (t) {
  testDecodeEncodeFile(t, 'test.torrent')
  testDecodeEncodeFile(t, 'bittorrent-v2-test.torrent')
  testDecodeEncodeFile(t, 'bittorrent-v2-hybrid-test.torrent')
})
