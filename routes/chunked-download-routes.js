/* global Buffer */
var apiModels = require.main.require('libs/models/apiModels'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper'),
	errorHelper = require.main.require('libs/helpers/errorHelper'),
	typeHelper = require.main.require('libs/helpers/typeHelper'),
	stringHelper = require.main.require('libs/helpers/stringHelper'),
	validators = require.main.require('libs/validators/chunked-download-validators');
	
var	debug = false,
	routePrefix = "/chunked/download",
	defaultTtl = 3600,
	chunkSize = 1024,
	io = null,
	dataCache = null;

var routes = {
	"get": new apiModels.RouteHandler(routePrefix + "/:downloadId/:index", function (req, res) {
		var index = parseInt(req.params.index);
		if (!guidHelper.isGuid(req.params.downloadId)){
			throw errorModels.ValidationError("The supplied downloadId is not a valid v4 GUID");	
		} else if (!typeHelper.isNumber(index)) {
			throw errorModels.ValidationError("The supplied index is not a valid number");
		}
		
		dataCache.restore(req.params.downloadId, function(error, keyVal) {
			errorHelper.genericErrorHandler(error);
			if(typeHelper.doesExist(keyVal.value)) {
				var download = keyVal.value,
					buffer = new Buffer(chunkSize);
				
				function readCallback(error, read, buffer) {
					
				}
				
				download.chunks[index] = true;
				dataCache.update(download.id, download, defaultTtl, function (error, success) {
					errorHelper.genericErrorHandler(error);
					if(success) {
						io.ReadFileChunk(download.path, buffer, 0, buffer.length, index * chunkSize, readCallback);
					} else {
						throw errorModels.ServerError();
					}
				});
			} else {
				throw errorModels.DownloadMissing();
			}
		});
	}),
	"post": new apiModels.RouteHandler(routePrefix, function (req, res) {
		var valid = validators.validateUploadRequest(req.body);
		if(valid !== validators.valid) {
			throw errorModels.ValidationError(valid);
		}
		io.getFileStats(req.body.path, function(error, stats) {
			var download = new apiModels.Download(req.body, stats.size, chunkSize);
			download.configure(guidHelper.newGuid());
			
			dataCache.create(download.id, download, defaultTtl, function (error, success) {
				errorHelper.genericErrorHandler(error);
				if(success) {
					res.json(new apiModels.ApiResponse(routePrefix, {}, download));
				} else {
					throw errorModels.ServerError();
				}
			});
		});
	}),
	"delete": new apiModels.RouteHandler(routePrefix + "/:downloadId", function (req, res) {
		if (!guidHelper.isGuid(req.params.downloadId)){
			throw errorModels.ValidationError("The supplied downloadId is not a valid v4 GUID");	
		}
		
		dataCache.restore(req.params.downloadId, function(error, download) {
			errorHelper.genericErrorHandler(error, debug);

			dataCache.delete(download.id, function (error, count) {
				errorHelper.genericErrorHandler(error);
				res.json(new apiModels.ApiResponse(routePrefix, {}, "Download: " + req.params.downloadId + ", deleted successfuly."));
			});
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
		if(typeHelper.isBoolean(options.debug)){
			debug = options.debug;
		}
		if(typeHelper.isString(options.routePrefix)){
			routePrefix = stringHelper.stripTrailingSlashes(options.routePrefix);
		}
		if(typeHelper.isNumber(options.chunkSize)) {
			chunkSize = options.chunkSize
		}
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;