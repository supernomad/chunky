/* global __dirname */
var express = require('express'),
	router = express.Router();
	
var multer = require('multer'),
	bodyParser = require('body-parser'),
	typeHelper = require('../libs/helpers/typeHelper'),
	io = require('../libs/io'),
	apiCache = null,
	uploadRoutes = null,
	downloadRoutes = null,
	tempChunkPath = __dirname + '/tmp/chunks';

function configure(cache, options) {
	if(!typeHelper.isObject(cache)) {
		apiCache = require('../libs/caching/localCache');
	}
	else {
		apiCache = cache;
	}
	
	if(!typeHelper.isObject(options)) {
		options = {};
	}
	
	uploadRoutes = require('../routes/chunked-upload-routes')(apiCache, io, options);
	downloadRoutes = require('../routes/chunked-download-routes')(apiCache, io, options);
	
	// Request parsing
	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({extended: false}));
	router.use(multer({
		dest: tempChunkPath,
	  	rename: function (fieldname, filename) {
	    	return filename.replace(/\W+/g, '-').toLowerCase() + '-' + fieldname.replace(/\W+/g, '-').toLowerCase();
	  	}
	}));
	
	// Upload routes
	router.get(uploadRoutes.get.uri, uploadRoutes.get.handler);
	router.post(uploadRoutes.post.uri, uploadRoutes.post.handler);
	router.put(uploadRoutes.put.uri, uploadRoutes.put.handler);
	router.delete(uploadRoutes.delete.uri, uploadRoutes.delete.handler);
	router.use(uploadRoutes.error.handler);
	
	// Download routes
	router.get(downloadRoutes.get.uri, downloadRoutes.get.handler);
	router.post(downloadRoutes.post.uri, downloadRoutes.post.handler);
	router.delete(downloadRoutes.delete.uri, downloadRoutes.delete.handler);
	router.use(downloadRoutes.error.handler);
	return router;
}

module.exports = configure;