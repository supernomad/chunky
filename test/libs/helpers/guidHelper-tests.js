/* global describe, it */
var should = require('should'),
	guidHelper = require.main.require('libs/helpers/guidHelper');
	
describe('guidHelper.js', function() {
	describe('#newGuid', function() {
		it('should return a valid v4 GUID', function() {
			var guid = guidHelper.newGuid();
			should.exist(guid);
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8,9,a,b][0-9a-f]{3}-[0-9a-f]{12}$/ig.test(guid).should.be.true();
		});
		
		it('should return a unique GUID on each call', function() {
			var guids = [];
			var iterations = 10000;
			function contains(arr, val) {
			var i = arr.length;
				while (i--) {
					if (arr[i] === val) {
						return true;
					}
				}
				return false;
			}
			
			for (var index = 0; index < iterations; index++) {
				var guid = guidHelper.newGuid();
				guids.push(guid);
				if(index > 0) {
					contains(guid, guids).should.be.false();
				}
			}
		});
	});
	
	describe('#isGuid', function() {
		it('should return true for a valid string v4 GUID', function() {
			var guid = guidHelper.newGuid();
			guidHelper.isGuid(guid).should.be.true();
		});
		
		it('should return false for anything other than a valid string v4 GUID', function() {
			guidHelper.isGuid('').should.be.false();
			guidHelper.isGuid({}).should.be.false();
			guidHelper.isGuid(null).should.be.false();
			guidHelper.isGuid(undefined).should.be.false();
			guidHelper.isGuid(0).should.be.false();
			guidHelper.isGuid(true).should.be.false();
		});
	});
});