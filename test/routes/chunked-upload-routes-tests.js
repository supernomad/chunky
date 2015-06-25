/* global describe, it, afterEach */
var	async = require('async'),
	should = require('should'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper');
	
describe("chunked-upload-routes.js", function() {
	var io_mock = require.main.require('mocks/libs/io'),
		cache_mock = require.main.require('mocks/libs/caching/localCache'),
		routes = require.main.require('routes/chunked-upload-routes')(cache_mock, io_mock, {debug:true, routePrefix:"/chunked/upload"}),
		uploadId = null;
	
	afterEach('reset the cache_mock', function() {
		cache_mock.setReturnValue(true);
		cache_mock.setReturnErrorOnDelete(false);
		cache_mock.setReturnErrorOnRestore(false);
		cache_mock.setReturnErrorOnCreate(false);
	});
	
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
					fileSize: 2048,
					chunkSize: 1024,
					count: 2,
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
			}, function(error) {
				should.not.exist(error);
			});
		});
		
		it('should throw a ServerError if the cache fails to store the upload data', function(done) {
			cache_mock.setReturnValue(false);
			routes.post.handler({
				body: {
					fileName: "Testing.txt",
					fileSize: 2048,
					chunkSize: 1024,
					count: 2,
					destination: "Test/destination"
				}
			},	{ 
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
				done();
			});
		});
		
		it('should throw a ValidationError if the request object is considered invalid', function(done) {
			routes.post.handler({
				body: {					
				}
			},	{ 
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
				done();
			});
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
			}, function(error) {
				should.not.exist(error);
			});
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
			routes.get.handler({
				params: {
					uploadId: "uploadId"
				}
			},	{
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should throw a UploadMissing error if the supplied uploadId does not exist', function() {
			routes.get.handler({
				params: {
					uploadId: guidHelper.newGuid()
				}
			},	{
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should handle an error thrown by the cache', function() {
			cache_mock.setReturnErrorOnRestore(true);
			routes.get.handler({
				params: {
					uploadId: guidHelper.newGuid()
				}
			},	{
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(Error);
			});
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
		
		it('should throw a ServerError when the specified uploadId does not exist', function() {
			cache_mock.setReturnValue(false);
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
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should upload a file chunk and associate it with the specified upload', function(done) {
			async.series ([
				function(callback) {
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
							try {
								should.exist(data);
								should.exist(data.data);
								data.data.should.be.an.String;
								data.data.should.equal("Chunk Recieved");
								callback(null);
							} catch(error) {
								callback(error);
							}
						}
					}, function(error) {
						should.not.exist(error);
					});
				},
				function(callback) {
					routes.put.handler({
						params: {
							uploadId: uploadId,
							index: 1
						},
						files: {
							testFile: {
								path: "random/path/to/nothing"
							}
						}
					}, {
						json: function(data) {
							try {
								should.exist(data);
								should.exist(data.data);
								data.data.should.be.an.String;
								data.data.should.equal("Upload Complete");
								callback(null);
							} catch(error) {
								callback(error);
							}
						}
					});
				}
			], function(error) {
				should.not.exist(error);
				done();
			});
		});
		
		it('should throw a ValidationError if the request is considered invalid', function() {
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should throw a ValidationError if the supplied index is considered invalid', function() {
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should throw a UploadMissing error if the supplied uploadId does not exist', function() {
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should handle an error thrown by the cache restoring an upload', function() {
			cache_mock.setReturnErrorOnRestore(true);
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(Error);
			});
		});
		
		it('should handle an error thrown by the cache updating an upload', function() {
			cache_mock.setReturnErrorOnCreate(true);
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
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(Error);
			});
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
			}, function(error) {
				should.not.exist(error);
			});
		});
		
		it('should throw a ValidationError if the supplied uploadId is considered invalid', function() {
			routes.delete.handler({
				params: {
					uploadId: "uploadId"
				}
			},	{
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
		
		it('should throw a UploadMissing error if the supplied uploadId does not exist', function() {
			routes.delete.handler({
				params: {
					uploadId: "uploadId"
				}
			},	{
				json: function(data) {
				}
			}, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(errorModels.GenericError);
			});
		});
	});
	
	describe("#ERROR", function() {
		it('should have a handler', function() {
			should.exist(routes.error);
			
			should.exist(routes.error.handler);
			routes.error.handler.should.be.a.Function;
		});
		
		it('should handle any custom errors', function(done) {
			async.series([
				function(callback) {
					routes.error.handler(errorModels.UploadMissing(), null, {
						status: function(status) {
							should.exist(status);
							status.should.be.a.Number;
							status.should.equal(404);
						},
						json: function(data) {
							try {
								should.exist(data);
								data.should.be.a.Object;
								should.exist(data.Error);
								should.exist(data.Message);
								callback(null);
							} catch (error) {
								callback(error);
							}
						}
					}, function() {
						should.fail();
					});
				},
				function(callback) {
					routes.error.handler(errorModels.ValidationError("error"), null, {
						status: function(status) {
							should.exist(status);
							status.should.be.a.Number;
							status.should.equal(400);
						},
						json: function(data) {
							try {
								should.exist(data);
								data.should.be.a.Object;
								should.exist(data.Error);
								should.exist(data.Message);
								callback(null);
							} catch(error) {
								callback(error);
							}
						}
					}, function() {
						should.fail();
					});
				},
				function(callback) {
					routes.error.handler(errorModels.ServerError(), null, {
						status: function(status) {
							should.exist(status);
							status.should.be.a.Number;
							status.should.equal(500);
						},
						json: function(data) {
							try {
								should.exist(data);
								data.should.be.a.Object;
								should.exist(data.Error);
								should.exist(data.Message);
								callback(null);
							} catch(error) {
								callback(error);
							}
						}
					}, function() {
						should.fail(); 
					});
				}
			], function(error) {
				should.not.exist(error);
				done();
			});
		});
		
		it('should call next if it is not a custom error', function(done) {
			routes.error.handler(new Error("Generic error"), null, null, function(error) {
				should.exist(error);
				error.should.be.an.instanceOf(Error);
				done();
			});
		});
	});
});