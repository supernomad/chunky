/* global Buffer */
var async = require('async'),
	apiModels = require.main.require('libs/models/apiModels'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper'),
	errorHelper = require.main.require('libs/helpers/errorHelper'),
	typeHelper = require.main.require('libs/helpers/typeHelper'),
	stringHelper = require.main.require('libs/helpers/stringHelper'),
	validators = require.main.require('libs/validators/chunked-upload-validators');
	
var	debug = false,
	routePrefix = "/chunked/upload",
	defaultTtl = 3600,
	io = null,
	dataCache = null;

var routes = {
	"get": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)) {
			next(errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID"));	
		} else {
			dataCache.restore(req.params.uploadId, function name(error, upload) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else if(!typeHelper.doesExist(upload.value)) {
					next(errorModels.UploadMissing());
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload.value));
				}
			});
		}
	}),
	"post": new apiModels.RouteHandler(routePrefix, function (req, res, next) {
		var validity = validators.validateUploadRequest(req.body);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else {
			var upload = new apiModels.Upload(req.body);
			upload.configure(guidHelper.newGuid());
	
			async.waterfall([
				function(callback) {
					dataCache.create(upload.id, upload, defaultTtl, function (error, success) {
						if(!success) {
							callback(errorModels.ServerError());
						} else {
							callback(error, upload);
						}
					});
				},
				function(upload, callback) {
					var buff = new Buffer(upload.fileSize);
					buff.fill(0);
					
					io.CreateFile(upload.tempPath, buff, 0, buff.length, function(error) {
						callback(error, upload);
					});
				}
			], function(error, upload) {
				if(typeHelper.doesExist(error)) next(error);
				res.json(new apiModels.ApiResponse(routePrefix, {}, upload.id));
			});
		}
	}),
	"put": new apiModels.RouteHandler(routePrefix + "/:uploadId/:index", function (req, res, next) {
		var validity = validators.validateChunkRequest(req);
		var index = parseInt(req.params.index);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID"));	
		} else if (!typeHelper.isNumber(index)) {
			next(errorModels.ValidationError("The supplied index is not a valid number"));
		} else {
			var file = {};
			for (var key in req.files) {
				if (req.files.hasOwnProperty(key)) {
					file = req.files[key];
					break;
				}
			}
			async.waterfall([
				function(callback) {
					dataCache.restore(req.params.uploadId, function(error, upload) {
						if(typeHelper.doesExist(error)) {
							callback(error);
						} else if(!typeHelper.doesExist(upload.value)) {
							callback(errorModels.UploadMissing());
						} else {
							callback(null, upload.value);
						}
					});
				},
				function(upload, callback) {
					upload.chunks[index] = true;
					dataCache.update(upload.Id, upload, defaultTtl, function(error, success) {
						if(typeHelper.doesExist(error)) {
							callback(error);
						} else if(!success) {
							callback(errorModels.ServerError());
						} else {
							callback(null, upload);
						}
					});
				},
				function(upload, callback) {
					io.ReadFile(file.path, function(error, data) {
						callback(error, upload, data);
					});
				},
				function(upload, data, callback) {
					io.WriteFileChunk(upload.TempPath, data, 0, data.length, index * upload.ChunkSize, function(error) {
						callback(error, upload);
					});
				},
				function(upload, callback) {
					async.every(upload.chunks, function(item, call) {
						call(item === true);
					}, function(result) {
						callback(null, upload, result);
					});
				},
				function(upload, complete, callback) {
					if(complete) {
						async.series([
							function(call) {
								io.RenameFile(upload.TempPath, upload.FinalPath, function(error) {
									call(error);
								});
							},
							function(call) {
								dataCache.delete(upload.id, function(error, count) {
									call(error);
								});
							}
						], function(error, results) {
							callback(error, upload, complete);
						});
					} else {
						callback(null, upload, complete);
					}
				}
			], function(error, upload, complete) {
				if(typeHelper.doesExist(error)) next(error);
				else if(complete) {
					res.json(new apiModels.ApiResponse(routePrefix, {}, "Upload Complete"));
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, "Chunk Recieved"));
				}
			});
		}
	}),
	"delete": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID"));	
		} else {
			async.waterfall([
				function(callback) {
					dataCache.restore(req.params.uploadId, function name(error, upload) {
						callback(error, upload);
					});
				},
				function(upload, callback) {
					dataCache.delete(upload.id, function (error, count) {
						callback(error, upload);
					});
				},
				function(upload, callback) {
					io.DeleteFile(upload.tempPath, function(deleteError) {
						callback(deleteError);
					});
				}
			], function(error) {
				if(typeHelper.doesExist(error)) next(error);
				res.json(new apiModels.ApiResponse(routePrefix, {}, "Upload: " + req.params.uploadId + ", deleted successfuly."));
			});
		}
	}),
	"error": new apiModels.ErrorHandler(function (error, req, res, next) {
		if(error instanceof errorModels.GenericError) {
			res.status(error.Code);
			res.json({
				Error: error.Error,
				Message: error.Message
			});
		} else {
			next(error);
		}
	})
};

function configure(cache, storage, options) {
	if(typeHelper.isObject(options)) {
		if(typeHelper.isBoolean(options.debug)){
			debug = options.debug;
		}
		if(typeHelper.isString(options.routePrefix)){
			routePrefix = stringHelper.stripTrailingSlashes(options.routePrefix);
		}
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;