/* global Buffer */
var async = require('async'),
	parseRange = require('range-parser'),
	typeHelper = require('./../helpers/typeHelper'),
	errorModels = require('./../models/errorModels'),
	apiModels = require('./../models/apiModels');

var options = {
	cache: require('./../caching/localCache'),
	io: require('./../io')
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
		function getTheTransfer(callback) {
			getTransfer(id, callback);
		},
		function deleteTheTransfer(transfer, callback) {
			options.cache.delete(transfer.id, function (error) {
				callback(error, transfer);
			});
		},
		function deleteTemporaryFiles(transfer, callback) {
			if(transfer.type === 'upload') {
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
	var upload = new apiModels.Transfer('upload', destination, fileSize, fileName);
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
			var buff = new Buffer(upload.size);
			buff.fill(0);
			
			options.io.CreateFile(upload.temp, buff, 0, buff.length, function(error) {
				callback(error, upload);
			});
		}
	], function uploadCreated(error, upload) {
		done(error, upload);
	});
}

function updateUpload(uploadId, buffer, range, ttl, done) {
	async.waterfall([
		function(callback) {
			getTransfer(uploadId, callback);
		},
		function(upload, callback) {
			upload.chunks.push({
				size: buffer.length
			});
			options.cache.update(upload.id, upload, ttl, function(error, success) {
				if(!success) {
					callback(errorModels.ServerError());
				} else {
					callback(error, upload);
				}
			});
		},
		function(upload, callback) {
			var r = parseRange(upload.size, range)[0];
			options.io.WriteFileChunk(upload.temp, buffer, 0, buffer.length, r.start, function(error) {
				callback(error, upload);
			});
		},
		function(upload, callback) {
			if(upload.complete) {
				async.series([
					function(call) {
						options.io.RenameFile(upload.temp, upload.path + '/' + upload.name, function(error) {
							call(error);
						});
					},
					function(call) {
						options.cache.delete(upload.id, function(error) {
							call(error);
						});
					}
				], function(error) {
					callback(error, upload);
				});
			} else {
				callback(null, upload);
			}
		}
	], function(error, upload) {
		done(error, upload);
	});
}

module.exports = {
	setOption: setOption,
	getTransfer: getTransfer,
	createUpload: createUpload,
	updateUpload: updateUpload,
	deleteTransfer: deleteTransfer
};