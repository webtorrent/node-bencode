var bencode = require('..')
var test = require('tape').test
var fs = require('fs')
var path = require('path')

var files = {
  test: fs.readFileSync(path.join(__dirname, 'data', 'test.torrent')),
  bittorrent2: fs.readFileSync(path.join(__dirname, 'data', 'bittorrent-v2-test.torrent')),
  bittorrent2Hybrid: fs.readFileSync(path.join(__dirname, 'data', 'bittorrent-v2-hybrid-test.torrent'))
}

test('Torrent test files', function (t) {
  t.test('should decode & encode `test.torrent` file', function (t) {
    t.plan(2)
    var decoded = bencode.decode(files.test)
    var encoded = bencode.encode(decoded)
    t.equal(encoded.length, files.test.length)
    t.deepEqual(encoded, files.test)
  })

  t.test('should decode & encode `bittorrent-v2-test.torrent` file', function (t) {
    t.plan(2)
    var decoded = bencode.decode(files.bittorrent2)
    var encoded = bencode.encode(decoded)
    t.equal(encoded.length, files.bittorrent2.length)
    t.deepEqual(encoded, files.bittorrent2)
  })

  t.test('should decode & encode `bittorrent-v2-hybrid-test.torrent` file', function (t) {
    t.plan(2)
    var decoded = bencode.decode(files.bittorrent2Hybrid)
    var encoded = bencode.encode(decoded)
    t.equal(encoded.length, files.bittorrent2Hybrid.length)
    t.deepEqual(encoded, files.bittorrent2Hybrid)
  })
})
