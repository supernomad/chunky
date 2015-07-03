var apiModels = require('../libs/models/apiModels'),
	errorModels = require('../libs/models/errorModels'),
	guidHelper = require('../libs/helpers/guidHelper'),
	typeHelper = require('../libs/helpers/typeHelper'),
	stringHelper = require('../libs/helpers/stringHelper'),
	downloadManager = null,
	validators = require('../libs/validators/chunked-download-validators');
	
var	debug = false,
	routePrefix = '/chunked',
	defaultTtl = 3600,
	chunkSize = 1024;

var routes = {
	'get': new apiModels.RouteHandler(routePrefix + '/download/:downloadId/:index', function (req, res, next) {
		var index = parseInt(req.params.index);
		if (!guidHelper.isGuid(req.params.downloadId)){
			next(errorModels.ValidationError('The supplied downloadId is not a valid v4 GUID'));	
		} else if (!typeHelper.isNumber(index)) {
			next(errorModels.ValidationError('The supplied index is not a valid number'));
		} else {
			downloadManager.updateDownload(req.params.downloadId, index, chunkSize, defaultTtl, function(error, buffer) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.send(buffer);
				}
			});
		}
	}),
	'post': new apiModels.RouteHandler(routePrefix + '/download', function(req, res, next) {
		var valid = validators.validateDownloadRequest(req.body);
		if(valid !== validators.valid) {
			next(errorModels.ValidationError(valid));
		} else {
			downloadManager.createDownload(req.body, chunkSize, defaultTtl, function(error, download){
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, download));
				} 
			});
		}
	}),
	'delete': new apiModels.RouteHandler(routePrefix + '/download/:downloadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.downloadId)){
			next(errorModels.ValidationError('The supplied downloadId is not a valid v4 GUID'));	
		} else {
			downloadManager.deleteDownload(req.params.downloadId, function(error) {
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

function configure(cache, io, options) {
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
		if(typeHelper.isNumber(options.defaultTtl)) {
			defaultTtl = options.defaultTtl;
		}
	}

	downloadManager = require('./../libs/managers/downloadManager')(cache, io);
	return routes;
};

module.exports = configure;