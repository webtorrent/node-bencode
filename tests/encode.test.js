var assert = require("assert");
var bencode = require('../bencode.js');
describe("bencode", function() {
	describe("#encode()", function() {
		it('should always return a string', function() {
			assert.equal(typeof(bencode.encode({})), "string");
			assert.equal(typeof(bencode.encode("test")), "string");
			assert.equal(typeof(bencode.encode([3, 2])), "string");
			assert.equal(typeof(bencode.encode({"a": "b", 3: 6})), "string");
			assert.equal(typeof(bencode.encode(123)), "string");
		});

		it('should be able to encode a number', function() {
			assert.equal(bencode.encode(123), 'i123e');
			assert.equal(bencode.encode(123.5), 'i123.5e');
		})
		it('should be able to encode a negative number', function() {
			assert.equal(bencode.encode(-123), 'i-123e');
			assert.equal(bencode.encode(-123.5), 'i-123.5e');
		})
		it('should be able to encode a string', function() {
			assert.equal(bencode.encode("asdf"), '4:asdf');
			assert.equal(bencode.encode(":asdf:"), '6::asdf:');
		})
		it('should be able to encode a unicode string', function() {
			assert.equal(bencode.encode("ö±sdf"), '7:ö±sdf');
			assert.equal(bencode.encode(new Buffer("ö±sdf")), '7:ö±sdf');
		})
		it('should be able to encode a buffer', function() {
			assert.equal(bencode.encode(new Buffer("asdf")), '4:asdf');
			assert.equal(bencode.encode(new Buffer(":asdf:")), '6::asdf:');
		})
		it('should be able to encode an array', function() {
			assert.equal(bencode.encode([32, 12]), 'li32ei12ee');
			assert.equal(bencode.encode([":asdf:"]), 'l6::asdf:e');
		})
		it('should be able to encode an object', function() {
			assert.equal(bencode.encode({"a": "bc"}), 'd1:a2:bce')
			assert.equal(bencode.encode({"a": "45", "b": 45}), 'd1:a2:451:bi45ee')
			assert.equal(bencode.encode({"a": new Buffer("bc")}), 'd1:a2:bce')
		})
	})
});