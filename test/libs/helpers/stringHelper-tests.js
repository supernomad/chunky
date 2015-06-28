/* global describe, it */
var should = require('should'),
	stringHelper = require.main.require('libs/helpers/stringHelper');
	
describe('stringHelper.js', function() {	
	describe('#stripTrailingSlashes', function() {
		it('should return the string unchanged if it does not have trailing slashes', function(){
			var s = 'testing';			
			var test = stringHelper.stripTrailingSlashes(s);
			should.exist(test);
			test.should.equal(s);
		});
		
		it('should return the string without trailing slashes if it has trailing back slashes', function(){
			var s = 'testing\\\\\\';
			var expected = 'testing';
			
			var test = stringHelper.stripTrailingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return the string without trailing slashes if it has trailing forward slashes', function(){
			var s = 'testing///';
			var expected = 'testing';
			
			var test = stringHelper.stripTrailingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return the string without trailing slashes if it has trailing forward and back slashes', function(){
			var s = 'testing///\\\\\\';
			var expected = 'testing';
			
			var test = stringHelper.stripTrailingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return an object unchanged if it is null/undefined, not a string, or an empty string', function(){
			var s = '';
			var expected = s;
			
			var test = stringHelper.stripTrailingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
			
			s = null;
			expected = s;
			test = stringHelper.stripTrailingSlashes(s);
			should.not.exist(test);
			
			s = undefined;
			expected = s;
			test = stringHelper.stripTrailingSlashes(s);
			should.not.exist(test);
			
			s = {};
			expected = s;
			test = stringHelper.stripTrailingSlashes(s);
			should.exist(s);
			test.should.equal(s);
		});
	});
	
	describe('#stripLeadingSlashes', function() {
		it('should return the string unchanged if it does not have leading slashes', function(){
			var s = 'testing';
			
			var test = stringHelper.stripLeadingSlashes(s);
			should.exist(test);
			test.should.equal(s);
		});
		
		it('should return the string without leading slashes if it has leading back slashes', function(){
			var s = '\\\\\\testing';
			var expected = 'testing';
			
			var test = stringHelper.stripLeadingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return the string without leading slashes if it has leading forward slashes', function(){
			var s = '///testing';
			var expected = 'testing';
			
			var test = stringHelper.stripLeadingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return the string without leading slashes if it has leading forward and back slashes', function(){
			var s = '///\\\\\\testing';
			var expected = 'testing';
			
			var test = stringHelper.stripLeadingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
		});
		
		it('should return an object unchanged if it is null/undefined, not a string, or an empty string', function(){
			var s = '';
			var expected = s;
			
			var test = stringHelper.stripLeadingSlashes(s);
			should.exist(test);
			test.should.equal(expected);
			
			s = null;
			expected = s;
			test = stringHelper.stripLeadingSlashes(s);
			should.not.exist(test);
			
			s = undefined;
			expected = s;
			test = stringHelper.stripLeadingSlashes(s);
			should.not.exist(test);
			
			s = {};
			expected = s;
			test = stringHelper.stripLeadingSlashes(s);
			should.exist(s);
			test.should.equal(s);
		});
	});
});