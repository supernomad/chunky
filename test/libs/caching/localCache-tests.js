/* global describe, it */
var should = require('should'),
	localCache = require.main.require('libs/caching/localCache');
	
describe('localCache.js', function () {
	describe('#create', function () {
		it('should create and object in the local cache.', function(done) {
			var object = { test: "object", testing: 0 };
			var key = "test-key-create";
			localCache.create(key, object, 30, function (error, success) {
				should.not.exist(error);
				should.exist(success);
				success.should.be.true;
				done();
			});
		});
		
		it('should return true/false if called without a callback', function() {
			var object = { test: "object", testing: 0 };
			var key = "test-key-create";
			var test = localCache.create(key, object, 30);
			should.exist(test);
			test.should.be.true;
		});
	});
	
	describe('#restore', function() {
		it('should restore the cache item with the specified key', function(done) {
			var object = { test: "object", testing: 0 };
			var key = "test-key-create";
			localCache.restore(key, function (error, keyVal) {
				should.not.exist(error);
				should.exist(keyVal);
				keyVal.key.should.equal(key);
				for (var hashKey in keyVal.value) {
					keyVal.value[hashKey].should.equal(object[hashKey]);
				}
				done();
			});
		});
		
		it('should return the key/value pair if called without a callback', function() {
			var object = { test: "object", testing: 0 };
			var key = "test-key-create";
			var test = localCache.restore(key);
			
			should.exist(test);
			test.key.should.equal(key);
			
			for (var hashKey in test.value) {
				test.value[hashKey].should.equal(object[hashKey]);
			}
		});
	});
	
	describe('#update', function() {
		it('should update the cache item with the new value using the specified key', function(done) {
			var object = { test: "object", testing: 2 };
			var key = "test-key-create";
			localCache.update(key, object, 30, function (error, success) {
				should.not.exist(error);
				should.exist(success);
				success.should.be.true;
				localCache.restore(key, function (error, keyVal) {
					should.not.exist(error);
					should.exist(keyVal);
					keyVal.key.should.equal(key);
					for (var hashKey in keyVal.value) {
						keyVal.value[hashKey].should.equal(object[hashKey]);
					}
					done();
				});
			});
		});
		
		it('should return true/false if called without a callback', function() {
			var object = { test: "object", testing: 0 };
			var key = "test-key-create";
			var test = localCache.update(key, object, 30);
			should.exist(test);
			test.should.be.true;
			
			test = localCache.restore(key);
			
			should.exist(test);
			test.key.should.equal(key);
			
			for (var hashKey in test.value) {
				test.value[hashKey].should.equal(object[hashKey]);
			}
		});
	});
	
	describe('#delete', function() {
		it('should delete the cache item with the specified key', function(done) {
			var key = "test-key-create";
			localCache.delete(key, function (error, count) {
				should.not.exist(error);
				should.exist(count);
				count.should.equal(1);
				done();
			});
		});
		
		it('should return the number of cache items deleted if called without a callback', function() {
			var key = "test-key-create";
			var test = localCache.delete(key);
			should.exist(test);
			test.should.equal(0);
		});
	});
});