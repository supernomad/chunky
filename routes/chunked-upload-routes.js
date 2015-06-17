var apiModels = require('./../libs/models/apiModels'),
	typeHelpers = require('./../libs/helpers/typeHelpers');
	
var	debug = false,
	io = null,
	dataCache = null;

var routes = {
	get: new apiModels.RouteHandler("/chunked/upload/:uploadId", function (req, res) {

	}),
	post: new apiModels.RouteHandler("/chunked/upload", function (req, res) {
		
	}),
	put: new apiModels.RouteHandler("/chunked/upload/:uploadId/:index", function (req, res) {
		
	}),
	del: new apiModels.RouteHandler("/chunked/upload/:uploadId", function (req, res) {
		
	}),
	err: new apiModels.ErrorHandler(function (error, req, res, next) {

	})
};

function configure(cache, storage, options) {
	if(!typeHelpers.isObject(options)) options = {};
	if(options.hasOwnProperty('debug')){
		debug = options.debug;
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;