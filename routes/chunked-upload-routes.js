var models = require('./../libs/models/apiModels'),
	typeHelpers = require('./../libs/helpers/typeHelpers');
	
var	debug = false,
	fileStore = null,
	dataCache = null;

var routes = {
	get: new models.RouteHandler("/chunked/upload/:uploadId", function (req, res) {

	}),
	post: new models.RouteHandler("/chunked/upload", function (req, res) {
		
	}),
	put: new models.RouteHandler("/chunked/upload/:uploadId/:index", function (req, res) {
		
	}),
	del: new models.RouteHandler("/chunked/upload/:uploadId", function (req, res) {
		
	}),
	err: new models.ErrorHandler(function (error, req, res, next) {

	})
};

function configure(cache, storage, options) {
	if(!typeHelpers.isObject(options)) options = {};
	if(options.hasOwnProperty('debug')){
		debug = options.debug;
	}
	
	fileStore = storage;
	dataCache = cache;
	return routes;
};	
module.exports = configure;