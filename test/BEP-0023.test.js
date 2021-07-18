const path = require('path')
const fs = require('fs')
const test = require('tape').test
const bencode = require('../lib/index.js')

// @see http://www.bittorrent.org/beps/bep_0023.html
test('BEP 0023', function (t) {
  t.test('should be able to handle an compacted peer announce', function (t) {
    const filename = path.join(__dirname, 'data', 'announce-compacted-peers.bin')
    const announce = fs.readFileSync(filename)
    const data = bencode.decode(announce)

    console.log(data)

    t.plan(1)
    t.deepEqual(data, {
      complete: 4,
      incomplete: 3,
      interval: 1800,
      'min interval': 1800,
      peers: Buffer.from('2ebd1b641a1f51d54c0546cc342190401a1f626ee9c6c8d5cb0d92131a1fac4e689a3c6b180f3d5746db', 'hex')
    })
  })

  t.test('should be able to handle an compacted peer announce when decoding strings', function (t) {
    const filename = path.join(__dirname, 'data', 'announce-compacted-peers.bin')
    const announce = fs.readFileSync(filename)
    const data = bencode.decode(announce, 'utf8')

    console.log(data)

    t.plan(1)
    t.deepEqual(data, {
      complete: 4,
      incomplete: 3,
      interval: 1800,
      'min interval': 1800,
      peers: '.�\u001bd\u001a\u001fQ�L\u0005F�4!�@\u001a\u001fbn�����\r�\u0013\u001a\u001f�Nh�<k\u0018\u000f=WF�'
    })
  })
})
