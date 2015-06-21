/* global describe, it */
var	should = require('should'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper');
	
describe("chunked-upload-routes.js", function() {
	var io_mock = require.main.require('mocks/libs/io'),
		cache_mock = require.main.require('mocks/libs/caching/localCache'),
		routes = require.main.require('routes/chunked-upload-routes')(cache_mock, io_mock, {debug:true, routePrefix:"/chunked/upload"}),
		uploadId = null;
	
	it('should return a route object', function() {
		should.exist(routes);
		routes.should.be.a.Object;
	});
	
	describe("#POST", function() {
		it('should have a uri and handler', function() {
			should.exist(routes.post);
			
			should.exist(routes.post.uri);
			routes.post.uri.should.be.a.String;
			
			should.exist(routes.post.handler);
			routes.post.handler.should.be.a.Function;
		});
		
		it('should create a new upload if the request object is considered valid', function(done) {
			routes.post.handler({
				body: {
					fileName: "Testing.txt",
					fileSize: 1024,
					chunkSize: 1024,
					count: 1,
					destination: "Test/destination"
				}
			},	{ 
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.a.String;
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8,9,a,b][0-9a-f]{3}-[0-9a-f]{12}$/ig.test(data.data).should.be.true;
					uploadId = data.data;
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the request object is considered invalid', function() {
			(function() {
				routes.post.handler({
					body: {					
					}
				},	{ 
					json: function(data) {
					}
				});
			}).should.throw();
		});
	});
	
	describe("#GET", function() {
		it('should have a uri and handler', function() {
			should.exist(routes.get);
			
			should.exist(routes.get.uri);
			routes.get.uri.should.be.a.String;
			
			should.exist(routes.get.handler);
			routes.get.handler.should.be.a.Function;
		});
		
		it('should return the requested upload if it exists and the supplied uploadId is a valid identifier', function(done) {
			routes.get.handler({
				params: {
					uploadId: uploadId
				}
			},	{
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.an.Object;
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
			(function() {
				routes.get.handler({
					params: {
						uploadId: "uploadId"
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
		
		it('should throw a MissingCacheItem error if the supplied uploadId does not exist', function() {
			(function() {
				routes.get.handler({
					params: {
						uploadId: guidHelper.newGuid()
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
	});
	
	describe("#PUT", function() {
		it('should have a uri and handler', function() {
			should.exist(routes.put);
			
			should.exist(routes.put.uri);
			routes.put.uri.should.be.a.String;
			
			should.exist(routes.put.handler);
			routes.put.handler.should.be.a.Function;
		});
		
		it('should upload a file chunk and associate it with the specified upload', function(done) {
			routes.put.handler({
				params: {
					uploadId: uploadId,
					index: 0
				},
				files: {
					testFile: {
						path: "random/path/to/nothing"
					}
				}
			}, {
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.an.String;
					data.data.should.equal("Upload Complete");
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the request is considered invalid', function() {
			(function() {
				routes.put.handler({
					params: {
						uploadId: uploadId,
						index: 0
					},
					files: {
						
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
			(function() {
				routes.put.handler({
					params: {
						uploadId: "uploadId",
						index: 0
					},
					files: {
						testFile: {
							path: "random/path/to/nothing"
						}
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
		
		it('should throw a ValidationError if the supplied index is considered invalid', function() {
			(function() {
				routes.put.handler({
					params: {
						uploadId: uploadId,
						index: "woot"
					},
					files: {
						testFile: {
							path: "random/path/to/nothing"
						}
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
		
		it('should throw a MissingCacheItem error if the supplied uploadId does not exist', function() {
			(function() {
				routes.put.handler({
					params: {
						uploadId: guidHelper.newGuid(),
						index: 0
					},
					files: {
						testFile: {
							path: "random/path/to/nothing"
						}
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
	});
	
	describe("#DELETE", function() {
		it('should have a uri and handler', function() {
			should.exist(routes.delete);
			
			should.exist(routes.delete.uri);
			routes.delete.uri.should.be.a.String;
			
			should.exist(routes.delete.handler);
			routes.delete.handler.should.be.a.Function;
		});
		
		it('should remove the specified upload from the cache and disk', function(done) {
			routes.delete.handler({
				params: {
					uploadId: uploadId
				}
			}, {
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.an.String;
					data.data.should.equal("Upload: " + uploadId + ", deleted successfuly.");
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
			(function() {
				routes.delete.handler({
					params: {
						uploadId: "uploadId"
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
		
		it('should throw a MissingCacheItem error if the supplied uploadId does not exist', function() {
			(function() {
				routes.delete.handler({
					params: {
						uploadId: "uploadId"
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw();
		});
	});
	
	describe("#ERROR", function() {
		it('should have a handler', function() {
			should.exist(routes.error);
			
			should.exist(routes.error.handler);
			routes.error.handler.should.be.a.Function;
		});
		
		it('should handle any custom errors', function(done) {
			routes.error.handler(errorModels.MissingCacheItem(), null, {
				status: function(status) {
					should.exist(status);
					status.should.be.a.Number;
					status.should.equal(404);
				},
				json: function(data) {
					should.exist(data);
					data.should.be.a.Object;
					should.exist(data.Error);
					should.exist(data.Message);
					routes.error.handler(errorModels.ValidationError("error"), null, {
						status: function(status) {
							should.exist(status);
							status.should.be.a.Number;
							status.should.equal(400);
						},
						json: function(data) {
							should.exist(data);
							data.should.be.a.Object;
							should.exist(data.Error);
							should.exist(data.Message);
							routes.error.handler(errorModels.ServerError(), null, {
								status: function(status) {
									should.exist(status);
									status.should.be.a.Number;
									status.should.equal(500);
								},
								json: function(data) {
									should.exist(data);
									data.should.be.a.Object;
									should.exist(data.Error);
									should.exist(data.Message);
									done();
								}
							}, function(){ false.should.be.true; });
						}
					}, function(){ false.should.be.true; });
				}
			}, function(){ false.should.be.true; });
		});
		
		it('should call next if it is not a custom error', function(done) {
			routes.error.handler(new Error("Generic error"), null, null, function() {
				true.should.be.true;
				done();
			});
		});
	});
});