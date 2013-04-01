var assert = require("assert");

var binary_key = new Buffer("ZDU6ZmlsZXNkMjA6N7VVuuCjmp5LoM+n15a5iM/XJHdkODpjb21wbGV0ZWkwZTEwOmRvd25sb2FkZWRpMTBlMTA6aW5jb21wbGV0ZWkwZWVlZQ==", 'base64')
var keyName = (new Buffer("N++/vVXvv73go5rvv71L77+9z6fXlu+/ve+/ve+/ve+/vSR3", 'base64')).toString();

var bencode = require('./lib.js');
describe("bencode", function() {
  describe("#decode(x)", function()  {
    it('should be able to decode an integer', function() {
      assert.deepEqual(bencode.decode('i123e'), 123);
    });
    it('should be able to decode a float', function() {
      assert.deepEqual(bencode.decode('i12.3e'), 12.3);
    });
    it('should be able to decode a string', function() {
      assert.deepEqual(bencode.decode('5:asdfe'), new Buffer('asdfe'));
      assert.deepEqual(bencode.decode('4:öö'), new Buffer('öö'));
    });
    it('should be able to decode "binary keys"', function() {
      assert.ok(bencode.decode(binary_key).files.hasOwnProperty(keyName));
    });

    it('should be able to decode a dictionary', function() {
      assert.deepEqual(
        bencode.decode( 'd3:cow3:moo4:spam4:eggse' ),
        {
          cow: new Buffer('moo'),
          spam: new Buffer('eggs')
        }
      )
      assert.deepEqual(
        bencode.decode( 'd4:spaml1:a1:bee' ),
        { spam: [ new Buffer('a'), new Buffer('b') ] }
      )
      assert.deepEqual(
        bencode.decode( 'd9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee'),
        {
          'publisher': new Buffer('bob'),
          'publisher-webpage': new Buffer('www.example.com'),
          'publisher.location': new Buffer('home')
        }
      )
    });

    it('should be able to decode a list', function() {
      assert.deepEqual(
        bencode.decode( 'l4:spam4:eggse'),
        [ new Buffer('spam'), new Buffer('eggs') ]
      )
    });
    it('should return the correct type', function() {
      assert.ok(bencode.decode('4:öö') instanceof Buffer);
    });
    it('should be able to decode integers (issue #12)', function() {
      var data = {
        string: 'Hello World',
        integer: 12345,
        dict: {
          key: 'This is a string within a dictionary'
        },
        list: [ 1, 2, 3, 4, 'string', 5, {} ]
      }
      var result = bencode.encode( data )
      var dat = bencode.decode ( result )
      assert.equal(dat.integer, 12345)
      assert.deepEqual(dat.list, [1, 2, 3, 4, new Buffer('string'), 5, {}])
    });
  });
});
