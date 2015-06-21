/* global describe, it, afterEach */
var	should = require('should'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper');
	
describe("chunked-upload-routes.js", function() {
	var io_mock = require.main.require('mocks/libs/io'),
		cache_mock = require.main.require('mocks/libs/caching/localCache'),
		routes = require.main.require('routes/chunked-download-routes')(cache_mock, io_mock, {debug:true, routePrefix:"/chunked/download", chunkSize: 1024}),
		downloadId = null;
	
	afterEach('reset the cache_mock', function() {
		cache_mock.setReturnValue(true);
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
		
		it('should create a new download if the request object is considered valid', function(done) {
			routes.post.handler({
				body: {
					path: "/i/am/a/path/to/a/destination"
				}
			},	{ 
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.a.Object;
					data.data.count.should.be.a.Number;
					data.data.chunkSize.should.be.a.Number;
					/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8,9,a,b][0-9a-f]{3}-[0-9a-f]{12}$/ig.test(data.data.id).should.be.true;
					downloadId = data.data.id;
					done();
				}
			});
		});
		
		it('should throw a ServerError if the cache fails to store the upload data', function() {
			cache_mock.setReturnValue(false);
			(function() {
				routes.post.handler({
					body: {
						path: "/i/am/a/path/to/a/destination"
					}
				},	{ 
					json: function(data) {
					}
				});
			}).should.throw(errorModels.GenericError);;
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
			}).should.throw(errorModels.GenericError);;
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
		
		it('should get the specified chunk from the specified download file', function(done) {
			routes.get.handler({
				params: {
					downloadId: downloadId,
					index: 0
				}
			}, {
				send: function(buffer) {
					should.exist(buffer);
					buffer.should.be.an.Buffer;
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the supplied downloadId is not a valid v4 GUID', function() {
			(function() {
				routes.get.handler({
					params: {
						downloadId: "downloadId",
						index: 0
					}
				}, {
					send: function(buffer) {
					}
				});
			}).should.throw(errorModels.GenericError);
		});

		it('should throw a ValidationError if the supplied index is not a valid number >= 0', function() {
			(function() {
				routes.get.handler({
					params: {
						downloadId: downloadId,
						index: ""
					}
				}, {
					send: function(buffer) {
					}
				});
			}).should.throw(errorModels.GenericError);
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
		
		it('should remove the specified download from the cache', function(done) {
			routes.delete.handler({
				params: {
					downloadId: downloadId
				}
			}, {
				json: function(data) {
					should.exist(data);
					should.exist(data.data);
					data.data.should.be.an.String;
					data.data.should.equal("Download: " + downloadId + ", deleted successfuly.");
					done();
				}
			});
		});
		
		it('should throw a ValidationError if the supplied downloadId is considered invalid', function() {
			(function() {
				routes.delete.handler({
					params: {
						downloadId: "downloadId"
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw(errorModels.GenericError);;
		});
		
		it('should throw a UploadMissing error if the supplied downloadId does not exist', function() {
			(function() {
				routes.delete.handler({
					params: {
						downloadId: "downloadId"
					}
				},	{
					json: function(data) {
					}
				});
			}).should.throw(errorModels.GenericError);;
		});
	});
	
	describe("#ERROR", function() {
		it('should have a handler', function() {
			should.exist(routes.error);
			
			should.exist(routes.error.handler);
			routes.error.handler.should.be.a.Function;
		});
		
		it('should handle any custom errors', function(done) {
			routes.error.handler(errorModels.DownloadMissing(), null, {
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