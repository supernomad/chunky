/* global describe, it */
var should = require('should'),
	typeHelpers = require('./../libs/helpers/typeHelpers')

describe('typeHelpers', function(){
  describe('#doesExist', function(){
    it('should return false when the value is null or undefined', function(){
   	   	var test = typeHelpers.doesExist(null);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.doesExist(undefined);
		should.exist(test);
		test.should.be.false;
    });
	
	it('should return true when the value is any defined object', function(){
   	   	var test = typeHelpers.doesExist({});
		should.exist(test);
		test.should.be.true;
		
		test = typeHelpers.doesExist("");
		should.exist(test);
		test.should.be.true;
		
		test = typeHelpers.doesExist(0);
		should.exist(test);
		test.should.be.true;
		
		test = typeHelpers.doesExist([]);
		should.exist(test);
		test.should.be.true;
		
		test = typeHelpers.doesExist(function() {});
		should.exist(test);
		test.should.be.true;
		
		test = typeHelpers.doesExist(true);
		should.exist(test);
		test.should.be.true;
    });
  });
  
  describe('#isObject', function() {
	 it('should return false when the value is not an object', function () {
		var test = typeHelpers.isObject("");
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isObject(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isObject(function() {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isObject(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is an object', function() {
		var test = typeHelpers.isObject({});
		should.exist(test);
		test.should.be.true;
	 });
  });
  
    describe('#isFunction', function() {
	 it('should return false when the value is not a function', function () {
		var test = typeHelpers.isFunction("");
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isFunction(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isFunction({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isFunction(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a function', function() {
		var test = typeHelpers.isFunction(function() {});
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isString', function() {
	 it('should return false when the value is not a string', function () {
		var test = typeHelpers.isString(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isString(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isString({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isString(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a string', function() {
		var test = typeHelpers.isString("");
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isBoolean', function() {
	 it('should return false when the value is not a boolean', function () {
		var test = typeHelpers.isBoolean(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isBoolean(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isBoolean({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isBoolean("");
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a boolean', function() {
		var test = typeHelpers.isBoolean(true);
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isNumber', function() {
	 it('should return false when the value is not a number', function () {
		var test = typeHelpers.isNumber(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isNumber(true);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isNumber({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelpers.isNumber("");
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a number', function() {
		var test = typeHelpers.isNumber(0);
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isType', function() {
	 it('should return false when the value is not the specified type', function () {
		var test = typeHelpers.isType(new Date(), String);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is the specified type', function() {
		var test = typeHelpers.isType(new Date(), Date);
		should.exist(test);
		test.should.be.true;
	 });
  });
});