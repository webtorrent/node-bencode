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
      var out;
      out = bencode.decode('d1:a5:halloe');
      assert.equal(out.a, "hallo");

      out = bencode.decode('d1:a5:hallo2:bci15ee');
      assert.equal(out.a, "hallo");
      assert.equal(out.bc, 15);
    });
    it('should be able to decode a list', function() {
      var out;
      out = bencode.decode('l2:as4:dfghe');
      assert.equal(out.length, 2);
      assert.equal(out[0], 'as');
      assert.equal(out[1], 'dfgh');

      out = bencode.decode('li13ei37ee');
      assert.equal(out.length, 2);
      assert.equal(out[0], 13);
      assert.equal(out[1], 37);
    });
    it('should return the correct type', function() {
      assert.ok(bencode.decode('4:öö') instanceof Buffer);
      assert.ok(typeof(bencode.decode('4:öö', 'utf8')) === 'string');
    });
  });
});
