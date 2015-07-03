/* global Buffer */
var async = require('async'),
	apiModels = require('../libs/models/apiModels'),
	errorModels = require('../libs/models/errorModels'),
	guidHelper = require('../libs/helpers/guidHelper'),
	typeHelper = require('../libs/helpers/typeHelper'),
	stringHelper = require('../libs/helpers/stringHelper'),
	uploadManager = null,
	validators = require('../libs/validators/chunked-upload-validators');
	
var	debug = false,
	routePrefix = '/chunked',
	defaultTtl = 3600,
	maxSize = 2147483648;

var routes = {
	'get': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)) {
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));	
		} else {
			uploadManager.restoreUpload(req.params.uploadId, function(error, upload) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload));
				}
			});
		}
	}),
	'post': new apiModels.RouteHandler(routePrefix + '/upload', function (req, res, next) {
		var validity = validators.validateUploadRequest(req.body, maxSize);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else {
			uploadManager.createUpload(req.body, defaultTtl, function(error, upload) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload.id));
				}
			});
		}
	}),
	'put': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId/:index', function (req, res, next) {
		var validity = validators.validateChunkRequest(req);
		var index = parseInt(req.params.index);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));	
		} else if (!typeHelper.isNumber(index)) {
			next(errorModels.ValidationError('The supplied index is not a valid number'));
		} else {
			var file = {};
			for (var key in req.files) {
				if (req.files.hasOwnProperty(key)) {
					file = req.files[key];
					break;
				}
			}
			uploadManager.updateUpload(req.params.uploadId, index, file, defaultTtl, function(error, upload, complete) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else if(complete) {
					res.json(new apiModels.ApiResponse(routePrefix, {}, 'Upload Complete'));
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, 'Chunk Recieved'));
				}
			});
		}
	}),
	'delete': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));	
		} else {
			uploadManager.deleteUpload(req.params.uploadId, function(error) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, 'Upload: ' + req.params.uploadId + ', deleted successfuly.'));
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
		if(typeHelper.isNumber(options.maxSize)) {
			maxSize = options.maxSize;
		}
		if(typeHelper.isNumber(options.defaultTtl)) {
			defaultTtl = options.defaultTtl;
		}
	}
	
	uploadManager = require('../libs/managers/uploadManager')(cache, io);
	return routes;
};
module.exports = configure;