/* global Buffer */
var async = require('async'),
	apiModels = require.main.require('libs/models/apiModels'),
	errorModels = require.main.require('libs/models/errorModels'),
	guidHelper = require.main.require('libs/helpers/guidHelper'),
	errorHelper = require.main.require('libs/helpers/errorHelper'),
	typeHelper = require.main.require('libs/helpers/typeHelper'),
	stringHelper = require.main.require('libs/helpers/stringHelper'),
	validators = require.main.require('libs/validators/chunked-download-validators');
	
var	debug = false,
	routePrefix = '/chunked/download',
	defaultTtl = 3600,
	chunkSize = 1024,
	io = null,
	dataCache = null;

var routes = {
	'get': new apiModels.RouteHandler(routePrefix + '/:downloadId/:index', function (req, res, next) {
		var index = parseInt(req.params.index);
		if (!guidHelper.isGuid(req.params.downloadId)){
			next(errorModels.ValidationError('The supplied downloadId is not a valid v4 GUID'));	
		} else if (!typeHelper.isNumber(index)) {
			next(errorModels.ValidationError('The supplied index is not a valid number'));
		} else {
			async.waterfall([
				function(callback) {
					dataCache.restore(req.params.downloadId, function(error, download) {
						if(typeHelper.doesExist(error)) {
							callback(error);
						} else if (typeHelper.doesExist(download.value)) {
							download.value.chunks[index] = true;
							callback(null, download.value);
						} else {
							callback(errorModels.DownloadMissing());
						}
					});
				},
				function(download, callback) {
					dataCache.update(download.id, download, defaultTtl, function(error, success) {
						callback(error, download, success);
					});
				},
				function(download, success, callback) {
					if(success) {
						var buff = new Buffer(chunkSize);
						io.ReadFileChunk(download.path, buff, 0, buff.length, index * chunkSize, function(error, read, buffer) {
							callback(error, buffer);
						});
					} else {
						callback(errorModels.ServerError());
					}
				}
			], function(error, result) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.send(result);
				}
			});
		}
	}),
	'post': new apiModels.RouteHandler(routePrefix, function(req, res, next) {
		var valid = validators.validateDownloadRequest(req.body);
		if(valid !== validators.valid) {
			next(errorModels.ValidationError(valid));
		} else {
			async.waterfall([
				function(callback) {
					io.GetFileStats(req.body.path, function(error, stats) {
						if(typeHelper.doesExist(error)) {
							callback(error);
						} else {
							var download = new apiModels.Download(req.body, stats.size, chunkSize);
							download.configure(guidHelper.newGuid());
							callback(null, download);
						}
					});
				},
				function(download, callback) {
					dataCache.create(download.id, download, defaultTtl, function(error, success) {
						callback(error, download, success);
					});
				}
			], function(error, download, success) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else if(success) {
					res.json(new apiModels.ApiResponse(routePrefix, {}, download));
				} else {
					next(errorModels.ServerError());
				}
			});
		}
	}),
	'delete': new apiModels.RouteHandler(routePrefix + '/:downloadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.downloadId)){
			next(errorModels.ValidationError('The supplied downloadId is not a valid v4 GUID'));	
		} else {
			async.waterfall([
				function(callback) {
					dataCache.restore(req.params.downloadId, function(error, download) {
						if(typeHelper.doesExist(error)) {
							callback(error);
						} else if (typeHelper.doesExist(download.value)) {
							callback(null, download.value);
						} else {
							callback(errorModels.DownloadMissing());
						}
					});
				},
				function(download, callback) {
					dataCache.delete(download.id, function(error, count) {
						callback(error, download);
					});
				}
			], function(error, result) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, 'Download: ' + req.params.downloadId + ', deleted successfuly.'));
				}
			});
		}
	}),
	'error': new apiModels.ErrorHandler(function (error, req, res, next) {
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
		if(typeHelper.isNumber(options.chunkSize)) {
			chunkSize = options.chunkSize;
		}
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;