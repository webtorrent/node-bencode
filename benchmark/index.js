
var Benchmark = require( 'benchmark' )
var fs        = require( 'fs' )

var bencode     = require( '../' )
var bencoding   = require( 'bencoding' )
var dht_bencode = require( 'dht-bencode' )
var bncode      = require( 'bncode' )

var suite = new Benchmark.Suite

var buffer = fs.readFileSync( __dirname + '/test.torrent' )
var object = bencode.decode( buffer, 'ascii' )
var string = bencode.encode( object )

suite
  // Encoding
  .add( 'bencode->encode( Object )', function () {
    bencode.encode( object )
  })
  .add( 'bencoding->encode( Object )', function () {
    bencoding.encode( object )
  })
  .add( 'dht-bencode->encode( Object )', function () {
    dht_bencode.bencode( object )
  })
  .add( 'bncode->encode( Object )', function () {
    bncode.encode( object )
  })
  // Decoding
  .add( 'bencode->decode( Buffer )', function () {
    bencode.decode( buffer )
  })
  .add( 'bencoding->decode( Buffer )', function () {
    bencoding.decode( buffer )
  })
  .add( 'dht-bencode->decode( Buffer )', function () {
    dht_bencode.bdecode( buffer )
  })
  .add( 'bncode->decode( Buffer )', function () {
    bncode.decode( buffer )
  })
  // Print cycle
  .on( 'cycle', function ( event, bench ) {
    console.log( bench.toString(), bench.error || '' )
  })
  .run()
