/* global Buffer */
var apiModels = require('./../libs/models/apiModels'),
	errorModels = require('./../libs/models/errorModels'),
	guidHelper = require('./../libs/helpers/guidHelper'),
	errorHelper = require('./../libs/helpers/errorHelper'),
	typeHelper = require('./../libs/helpers/typeHelper'),
	stringHelper = require('./../libs/helpers/stringHelper'),
	validators = require('./../libs/validators/chunked-upload-validators');
	
var	debug = false,
	routePrefix = "/chunked/upload",
	defaultTtl = 3600,
	io = null,
	dataCache = null;

var routes = {
	"get": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			throw new errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID");	
		}
		
		dataCache.restore(req.params.uploadId, function name(error, upload) {
			errorHelper.genericErrorHandler(error, debug);
			if(typeHelper.doesExist(upload)){
				res.json(new apiModels.ApiResponse(routePrefix, {}, upload.value));
			} else {
				throw new errorModels.MissingCacheItem();
			}
		});
	}),
	"post": new apiModels.RouteHandler(routePrefix, function (req, res) {
		var valid = validators.validateUploadRequest(req.body);
		if(valid !== validators.valid) {
			throw new errorModels.ValidationError(valid);
		}
		
		var upload = new apiModels.Upload(req.body);
		upload.configure(guidHelper.newGuid());
		
		dataCache.create(upload.id, upload, defaultTtl, function (error, success) {
			errorHelper.genericErrorHandler(error);
			if(success) {
				var buff = new Buffer(upload.fileSize);
				buff.fill(0);
				io.CreateFile(upload.tempPath, buff, 0, buff.length, function(createError) {
					errorHelper.genericErrorHandler(createError);
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload.id));
				});
			} else {
				throw new errorModels.ServerError();
			}
		});
	}),
	"put": new apiModels.RouteHandler(routePrefix + "/:uploadId/:index", function (req, res) {
		var valid = validators.validateChunkRequest(req);
		var index = parseInt(req.params.index);
		if(valid !== validators.valid) {
			throw new errorModels.ValidationError(valid);
		} else if (!guidHelper.isGuid(req.params.uploadId)){
			throw new errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID");	
		} else if (!typeHelper.isNumber(index)) {
			throw new errorModels.ValidationError("The supplied index is not a valid number");
		}
		
		dataCache.restore(req.params.uploadId, function(error, upload) {
			errorHelper.genericErrorHandler(error, debug);
			var file = {};
			for (var key in req.files) {
				if (req.files.hasOwnProperty(key)) {
					file = req.files[key];
					break;
				}
			}
			
			function readCallback(error, data) {
				errorHelper.genericErrorHandler(error, debug);
				io.WriteFileChunk(upload.TempPath, data, 0, data.length, index * upload.ChunkSize, writeChunkCallback);
			}

			function writeChunkCallback(error) {
				errorHelper.genericErrorHandler(error, debug);
				if (upload.chunks.every(function(val){
					return val === true;
				})) 
				{
					io.RenameFile(upload.TempPath, upload.FinalPath, renameCallback);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, "Chunk Recieved"));
				}
			}
			
			function renameCallback(error) {
				errorHelper.genericErrorHandler(error, debug);
				dataCache.remove(upload.id, function(error, count) {
					errorHelper.genericErrorHandler(error, debug);
				});
				res.json(new apiModels.ApiResponse(routePrefix, {}, "Chunk Recieved"));
			};
			
			if(upload) {
				upload.chunks[index] = true;
				dataCache.update(upload.Id, upload, function(error, success) {
					errorHelper.genericErrorHandler(error, debug);
					if(success) {
						io.ReadFile(file.path, readCallback);
					} else {
						throw new errorModels.ServerError();
					}
				});
			} else {
				throw new errorModels.MissingCacheItem();
			}
		});
	}),
	"delete": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			throw new errorModels.ValidationError("The supplied uploadId is not a valid v4 GUID");	
		}
		
		dataCache.restore(req.params.uploadId, function name(error, upload) {
			errorHelper.genericErrorHandler(error, debug);
			if(typeHelper.doesExist(upload)){
				dataCache.remove(upload.id, function (error, count) {
					errorHelper.genericErrorHandler(error);
					if(count ===  1) {
						io.DeleteFile(upload.tempPath, function(deleteError) {
							errorHelper.genericErrorHandler(deleteError);
							res.json(new apiModels.ApiResponse(routePrefix, {}, "Upload: " + req.params.uploadId + ", deleted successfuly."));
						});
					} else {
						throw new errorModels.MissingCacheItem();
					}
				});
			} else {
				throw new errorModels.MissingCacheItem();
			}
		});
	}),
	"error": new apiModels.ErrorHandler(function (error, req, res, next) {
			if(error instanceof errorModels.GenericError) {
				res.status(error.Code);
				res.json({
					Error: error.Error,
					Message: error.Message
				});
			} else {
				next();
			}
	})
};

function configure(cache, storage, options) {
	if(typeHelper.isObject(options)) {
		if(options.hasOwnProperty('debug') && typeHelper.isBoolean(options.debug)){
			debug = options.debug;
		}
		if(options.hasOwnProperty('routePrefix') && typeHelper.isString(options.routePrefix)){
			routePrefix = stringHelper.stripTrailingSlashes(options.routePrefix);
		}
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;