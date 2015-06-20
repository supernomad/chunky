/* global Buffer */
var apiModels = require('./../libs/models/apiModels'),
	errorModels = require('./../libs/models/errorModels'),
	guidHelper = require('./../libs/helpers/guidHelper'),
	errorHelper = require('./../libs/helpers/errorHelper'),
	typeHelper = require('./../libs/helpers/typeHelper'),
	stringHelper = require('./../libs/helpers/stringHelper');
	
var	debug = false,
	routePrefix = "/chunked/upload",
	defaultTtl = 3600,
	io = null,
	dataCache = null;

var routes = {
	"get": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {
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
		// TODO: add validation of the request parameters
		
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
		// TODO: add validation of the request parameters
		
	}),
	"delete": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {
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