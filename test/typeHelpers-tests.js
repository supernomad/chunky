/* global describe, it */
var should = require('should'),
	typeHelper = require('./../libs/helpers/typeHelper');

describe('typeHelper', function(){
  describe('#doesExist', function(){
    it('should return false when the value is null or undefined', function(){
   	   	var test = typeHelper.doesExist(null);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.doesExist(undefined);
		should.exist(test);
		test.should.be.false;
    });
	
	it('should return true when the value is any defined object', function(){
   	   	var test = typeHelper.doesExist({});
		should.exist(test);
		test.should.be.true;
		
		test = typeHelper.doesExist("");
		should.exist(test);
		test.should.be.true;
		
		test = typeHelper.doesExist(0);
		should.exist(test);
		test.should.be.true;
		
		test = typeHelper.doesExist([]);
		should.exist(test);
		test.should.be.true;
		
		test = typeHelper.doesExist(function() {});
		should.exist(test);
		test.should.be.true;
		
		test = typeHelper.doesExist(true);
		should.exist(test);
		test.should.be.true;
    });
  });
  
  describe('#isObject', function() {
	 it('should return false when the value is not an object', function () {
		var test = typeHelper.isObject("");
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isObject(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isObject(function() {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isObject(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is an object', function() {
		var test = typeHelper.isObject({});
		should.exist(test);
		test.should.be.true;
	 });
  });
  
    describe('#isFunction', function() {
	 it('should return false when the value is not a function', function () {
		var test = typeHelper.isFunction("");
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isFunction(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isFunction({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isFunction(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a function', function() {
		var test = typeHelper.isFunction(function() {});
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isString', function() {
	 it('should return false when the value is not a string', function () {
		var test = typeHelper.isString(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isString(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isString({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isString(true);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a string', function() {
		var test = typeHelper.isString("");
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isBoolean', function() {
	 it('should return false when the value is not a boolean', function () {
		var test = typeHelper.isBoolean(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isBoolean(0);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isBoolean({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isBoolean("");
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a boolean', function() {
		var test = typeHelper.isBoolean(true);
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isNumber', function() {
	 it('should return false when the value is not a number', function () {
		var test = typeHelper.isNumber(function () {});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isNumber(true);
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isNumber({});
		should.exist(test);
		test.should.be.false;
		
		test = typeHelper.isNumber("");
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is a number', function() {
		var test = typeHelper.isNumber(0);
		should.exist(test);
		test.should.be.true;
	 });
  });
  
  describe('#isType', function() {
	 it('should return false when the value is not the specified type', function () {
		var test = typeHelper.isType(new Date(), String);
		should.exist(test);
		test.should.be.false;
	 });
	 
	 it('should return true when the value is the specified type', function() {
		var test = typeHelper.isType(new Date(), Date);
		should.exist(test);
		test.should.be.true;
	 });
  });
});