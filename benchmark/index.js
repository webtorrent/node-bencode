
var bencode   = require( '../' )
var old       = require( './bencode.old' )
var Benchmark = require( 'benchmark' )
var fs        = require( 'fs' )

var suite = new Benchmark.Suite

var buffer = fs.readFileSync( __dirname + '/test.torrent' )
var data   = bencode.decode( buffer, true )
var string = bencode.encode( data )

suite
  .add( 'new#encode( Object )', function () {
    bencode.encode( data )
  })
  .add( 'old#encode( Object )', function () {
    old.encode( data )
  })
  .add( 'new#decode( Buffer )', function () {
    bencode.decode( buffer )
  })
  .add( 'new#decode( Buffer, true )', function () {
    bencode.decode( buffer, true )
  })
  .add( 'old#decode( String )', function () {
    old.decode( string )
  })
  .on( 'cycle', function ( event, bench ) {
    console.log( bench.toString(), bench.error || '' )
  })
  .run()
