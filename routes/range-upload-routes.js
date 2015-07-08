var apiModels = require('../libs/models/apiModels'),
	errorModels = require('../libs/models/errorModels'),
	guidHelper = require('../libs/helpers/guidHelper'),
	typeHelper = require('../libs/helpers/typeHelper'),
	stringHelper = require('../libs/helpers/stringHelper'),
	byteHelper = require('../libs/helpers/byteHelper'),
	manager = require('../libs/managers/byteRangeManager'),
	validators = require('../libs/validators/range-upload-validators'),
	path = require('path');
	
var	routePrefix = '/range',
	defaultTtl = 3600,
	maxSize = byteHelper.gB * 5,
	uploadRoot = 'tmp/tests';

var routes = {
	'get': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));	
		} else {
			manager.getTransfer(req.params.uploadId, function(error, upload) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload));
				}
			});
		}
	}),
	'post': new apiModels.RouteHandler(routePrefix + '/upload', function (req, res, next) {
		var validity = validators.validateUploadRequest(req, maxSize);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else {
			var dest = typeHelper.isString(req.body.destination) 
				? path.join(uploadRoot, req.body.destination)
				: uploadRoot;
			
			manager.createUpload(dest, req.body.fileSize, req.body.fileName, defaultTtl, function(error, upload) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload));
				}
			});
		}
	}),
	'put': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId', function (req, res, next) {
		var validity = validators.validateUploadChunkRequest(req);
		if(validity !== validators.valid) {
			next(errorModels.ValidationError(validity));
		} else if(!guidHelper.isGuid(req.params.uploadId)) {
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));
		} else {
			var file = {};
			for (var key in req.files) {
				file = req.files[key];
			}
			manager.updateUpload(req.params.uploadId, file.buffer, req.header('range'), defaultTtl, function(error, upload){
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, upload));
				}
			});
		}
	}),
	'delete': new apiModels.RouteHandler(routePrefix + '/upload/:uploadId', function (req, res, next) {
		if (!guidHelper.isGuid(req.params.uploadId)){
			next(errorModels.ValidationError('The supplied uploadId is not a valid v4 GUID'));	
		} else {
			manager.deleteTransfer(req.params.uploadId, function(error) {
				if(typeHelper.doesExist(error)) {
					next(error);
				} else {
					res.json(new apiModels.ApiResponse(routePrefix, {}, 'Upload ' + req.params.uploadId + ', has been deleted.'));
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
	
	manager.setOption('cache', cache);
	manager.setOption('io', io);
	return routes;
};
module.exports = configure;