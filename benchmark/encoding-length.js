var fs = require( 'fs' )
var bencode = require( '..' )

var buffer = fs.readFileSync( __dirname + '/test.torrent' )
var torrent = bencode.decode( buffer )

suite( 'encoding length', function() {
  
  bench( 'torrent', function() {
    bencode.encodingLength( torrent )
  })
  
  bench( 'buffer', function() {
    bencode.encodingLength( buffer )
  })
  
  bench( 'string', function() {
    bencode.encodingLength( 'Test, test, this is a string' )
  })
  
  bench( 'number', function() {
    bencode.encodingLength( 87641234567 )
  })
  
  bench( 'array<number>', function() {
    bencode.encodingLength([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ])
  })
  
  bench( 'small object', function() {
    bencode.encodingLength({ a: 1, b: 'c', d: 'abcdefg', e: [1,2,3] })
  })
  
})
