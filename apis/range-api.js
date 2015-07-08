/* global __dirname */
var express = require('express'),
	router = express.Router();
	
var multer = require('multer'),
	bodyParser = require('body-parser'),
	typeHelper = require('../libs/helpers/typeHelper'),
	apiCache = require('../libs/caching/localCache'),
	io = require('../libs/io');

function configure(options) {
	// Request parsing
	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({extended: false}));
	// Handle multi-part file uploads
	router.use(multer({
		inMemory: true
	}));
	
	// Upload routes
	var uploadRoutes = require('../routes/range-upload-routes')(apiCache, io, options);
	router.get(uploadRoutes.get.uri, uploadRoutes.get.handler);
	router.post(uploadRoutes.post.uri, uploadRoutes.post.handler);
	router.put(uploadRoutes.put.uri, uploadRoutes.put.handler);
	router.delete(uploadRoutes.delete.uri, uploadRoutes.delete.handler);
	router.use(uploadRoutes.error.handler);
	
	// Return the configured router to be 'use'd via another express router or app
	return router;
}

module.exports = configure;