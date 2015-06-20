/* global describe, it */
var should = require('should'),
	errorHelper = require('./../libs/helpers/errorHelper');
	
describe('errorHelper.js', function() {
	describe('#genericErrorHandler', function() {
		it('should throw an error if passed a valid object', function() {
			(function () {
				errorHelper.genericErrorHandler("Error");
				errorHelper.genericErrorHandler({});
				errorHelper.genericErrorHandler(1);
				errorHelper.genericErrorHandler(-1);
				errorHelper.genericErrorHandler(true);
			}).should.throw();
		});
		
		it('should not throw an error if passed a non valid object', function() {
			(function () {
				errorHelper.genericErrorHandler("");
				errorHelper.genericErrorHandler(0);
				errorHelper.genericErrorHandler(false);
				errorHelper.genericErrorHandler(null);
				errorHelper.genericErrorHandler(undefined);
			}).should.not.throw();
		});
		
		it('should write the error to console.error if passed a trueish as the second argument', function() {
			(function () {
				errorHelper.genericErrorHandler("Error", true);
			}).should.throw();
		});
	});
});