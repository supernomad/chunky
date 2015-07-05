/* global Buffer */
var async = require('async'),
	typeHelper = require('./../helpers/typeHelper'),
	errorModels = require('./../models/errorModels'),
	apiModels = require('./../models/apiModels');

var options = {
	cache: require('./../caching/localCache'),
	io: require('./../io'),
	tempUploadPath: ""
};

function setOption(option, value) {
	if(options.hasOwnProperty(option)) {
		options[option] = value;
	}
}

function getTransfer(id, done) {
	options.cache.restore(id, function(error, transfer) {
		if(typeHelper.doesExist(error)) {
			done(error);
		} else if (!typeHelper.doesExist(transfer.value)) {
			done(errorModels.DownloadMissing());
		} else {
			done(null, transfer.value);
		}
	});
}

function deleteTransfer(id, done) {
	async.waterfall([
		function(callback) {
			getTransfer(id, callback);
		},
		function(transfer, callback) {
			options.cache.delete(transfer.id, function (error) {
				callback(error, transfer);
			});
		},
		function(transfer, callback) {
			if(transfer.type == 'upload') {
				options.io.DeleteFile(transfer.temp, function(error) {
					callback(error);
				});
			} else {
				callback(null);
			}
		}
	], function(error) {
		done(error);
	});
}

function createUpload(destination, fileSize, fileName, ttl, done) {
	var upload = apiModels.Transfer('upload', destination, fileSize, fileName);
	async.waterfall([
		function createUploadInCache(callback) {
			options.cache.create(upload.id, upload, ttl, function (error, success) {
				if(!success) {
					callback(errorModels.ServerError());
				} else {
					callback(error, upload);
				}
			});
		},
		function createTemporaryFile(upload, callback) {
			var buff = new Buffer(upload.fileSize);
			buff.fill(0);
			
			options.io.CreateFile(upload.tempPath, buff, 0, buff.length, function(error) {
				callback(error, upload);
			});
		}
	], function uploadCreated(error, upload) {
		done(error, upload);
	});
}

module.exports = {
	setOption: setOption,
	getTransfer: getTransfer,
	createUpload: createUpload,
	deleteTransfer: deleteTransfer
};