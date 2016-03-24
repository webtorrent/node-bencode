var bencode = require( '..' )
var test = require( 'tape' ).test

test( 'abstract encoding', function( t ) {
  
  t.test( 'encodingLength( value )', function( t ) {
    var input = { string: 'Hello World', integer: 12345 }
    var output = new Buffer( 'd7:integeri12345e6:string11:Hello Worlde' )
    t.plan( 1 )
    t.equal( bencode.encodingLength( input ), output.length )
  })
  
  t.test( 'encode.bytes', function( t ) {
    var output = bencode.encode({ string: 'Hello World', integer: 12345 })
    t.plan( 1 )
    t.equal( output.length, bencode.encode.bytes )
  })
  
  t.test( 'encode into an existing buffer', function( t ) {
    var input = { string: 'Hello World', integer: 12345 }
    var output = new Buffer( 'd7:integeri12345e6:string11:Hello Worlde' )
    var target = new Buffer( output.length )
    bencode.encode( input, target )
    t.plan( 1 )
    t.deepEqual( target, output )
  })
  
  t.test( 'encode into a buffer with an offset', function( t ) {
    var input = { string: 'Hello World', integer: 12345 }
    var output = new Buffer( 'd7:integeri12345e6:string11:Hello Worlde' )
    var target = new Buffer( 64 + output.length ) // Pad with 64 bytes
    var offset = 48
    bencode.encode( input, target, offset )
    t.plan( 1 )
    t.deepEqual( target.slice( offset, offset + output.length ), output )
  })
  
  t.test( 'decode.bytes', function( t ) {
    var input = new Buffer( 'd7:integeri12345e6:string11:Hello Worlde' )
    var output = bencode.decode( input )
    t.plan( 1 )
    t.equal( bencode.decode.bytes, input.length )
  })
  
  t.test( 'decode from an offset', function( t ) {
    var pad = '_______________________________'
    var input = new Buffer( pad + 'd7:integeri12345e6:string11:Hello Worlde' )
    var output = bencode.decode( input, pad.length, 'utf8' )
    t.plan( 1 )
    t.deepEqual( output, { string: 'Hello World', integer: 12345 })
  })
  
  t.test( 'decode between an offset and end', function( t ) {
    var pad = '_______________________________'
    var data = 'd7:integeri12345e6:string11:Hello Worlde'
    var input = new Buffer( pad + data + pad )
    var output = bencode.decode( input, pad.length, pad.length + data.length, 'utf8' )
    t.plan( 1 )
    t.deepEqual( output, { string: 'Hello World', integer: 12345 })
  })
  
})
