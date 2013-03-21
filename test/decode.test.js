var assert = require("assert");

var binary_key = new Buffer("ZDU6ZmlsZXNkMjA6N7VVuuCjmp5LoM+n15a5iM/XJHdkODpjb21wbGV0ZWkwZTEwOmRvd25sb2FkZWRpMTBlMTA6aW5jb21wbGV0ZWkwZWVlZQ==", 'base64')
var keyName = (new Buffer("N++/vVXvv73go5rvv71L77+9z6fXlu+/ve+/ve+/ve+/vSR3", 'base64')).toString();

var bencode = require('../bencode.js');
describe("bencode", function() {
  describe("#decode()", function() {
    it('should be able to decode a number', function() {
      assert.equal(bencode.decode('i123e'), 123);
      assert.equal(bencode.decode('i123.5e'), 123.5);
    });
    it('should be able to decode a string', function() {
      assert.equal(bencode.decode('5:asdfe'), 'asdfe');
      assert.equal(bencode.decode('4:öö'), 'öö');
      assert.equal(bencode.decode('4:öö', 'utf8'), 'öö');
    });
    it('should be able to decode "binary keys"', function() {
      assert.equal(true, bencode.decode(binary_key).files.hasOwnProperty(keyName));
    });
    it('should be able to decode a dictionary', function() {
      assert.deepEqual(
        bencode.decode( 'd3:cow3:moo4:spam4:eggse', 'utf8' ),
        { cow: 'moo', spam: 'eggs' }
      )
      assert.deepEqual(
        bencode.decode( 'd4:spaml1:a1:bee', 'utf8' ),
        { spam: [ 'a', 'b' ] }
      )
      assert.deepEqual(
        bencode.decode( 'd9:publisher3:bob17:publisher-webpage15:www.example.com18:publisher.location4:homee', 'utf8' ),
        {
          'publisher': 'bob',
          'publisher-webpage': 'www.example.com',
          'publisher.location': 'home'
        }
      )
    });
    it('should be able to decode a list', function() {
      assert.deepEqual(
        bencode.decode( 'l4:spam4:eggse', 'utf8' ),
        [ 'spam', 'eggs' ]
      )
    });
    it('should return the correct type', function() {
      assert.ok(bencode.decode('4:öö') instanceof Buffer);
      assert.ok(typeof(bencode.decode('4:öö', 'utf8')) === 'string');
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
      var dat = bencode.decode ( result , 'utf8')
      assert.equal(dat.integer, 12345)
      assert.deepEqual(dat.list, [1, 2, 3, 4, 'string', 5, {}])
    });
  });
});
