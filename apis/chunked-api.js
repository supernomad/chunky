/* global __dirname */
var express = require('express'),
	router = express.Router();
	
var multer = require('multer'),
	bodyParser = require('body-parser'),
	typeHelper = require('../libs/helpers/typeHelper'),
	apiCache = require('../libs/caching/localCache'),
	io = require('../libs/io'),
	tempChunkPath = __dirname + '/tmp/chunks';

function configure(options) {
	if(typeHelper.isObject(options) && typeHelper.isString(options.tempChunkPath)) {
		// Set the temporary upload chunk storage path
		tempChunkPath = options.tempChunkPath;
	}
	
	// Request parsing
	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({extended: false}));
	// Handle multi-part file uploads
	router.use(multer({
		dest: tempChunkPath,
	  	rename: function (fieldname, filename) {
	    	return filename.replace(/\W+/g, '-').toLowerCase() + '-' + fieldname.replace(/\W+/g, '-').toLowerCase();
	  	}
	}));
	
	// Upload routes
	var uploadRoutes = require('../routes/chunked-upload-routes')(apiCache, io, options);
	router.get(uploadRoutes.get.uri, uploadRoutes.get.handler);
	router.post(uploadRoutes.post.uri, uploadRoutes.post.handler);
	router.put(uploadRoutes.put.uri, uploadRoutes.put.handler);
	router.delete(uploadRoutes.delete.uri, uploadRoutes.delete.handler);
	router.use(uploadRoutes.error.handler);
	
	// Download routes
	var downloadRoutes = require('../routes/chunked-download-routes')(apiCache, io, options);
	router.get(downloadRoutes.get.uri, downloadRoutes.get.handler);
	router.post(downloadRoutes.post.uri, downloadRoutes.post.handler);
	router.delete(downloadRoutes.delete.uri, downloadRoutes.delete.handler);
	router.use(downloadRoutes.error.handler);
	
	// Return the configured router to be 'use'd via another express router or app
	return router;
}

module.exports = configure;