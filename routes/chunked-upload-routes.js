var apiModels = require('./../libs/models/apiModels'),
	typeHelpers = require('./../libs/helpers/typeHelpers');
	
var	debug = false,
	routePrefix = "/chunked/upload",
	io = null,
	dataCache = null;

var routes = {
	"get": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {

	}),
	"post": new apiModels.RouteHandler(routePrefix, function (req, res) {
		
	}),
	"put": new apiModels.RouteHandler(routePrefix + "/:uploadId/:index", function (req, res) {
		
	}),
	"delete": new apiModels.RouteHandler(routePrefix + "/:uploadId", function (req, res) {
		
	}),
	"error": new apiModels.ErrorHandler(function (error, req, res, next) {

	})
};

function configure(cache, storage, options) {
	if(!typeHelpers.isObject(options)) options = {};
	if(options.hasOwnProperty('debug')){
		debug = options.debug;
	}
	if(options.hasOwnProperty('routePrefix')){
		routePrefix = options.routePrefix;
	}
	
	io = storage;
	dataCache = cache;
	return routes;
};
module.exports = configure;