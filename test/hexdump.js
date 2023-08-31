#!/usr/bin/env node

import fs from 'fs'

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

const buffer = fs.readFileSync(process.argv[2])

console.log(hexdump(buffer))
