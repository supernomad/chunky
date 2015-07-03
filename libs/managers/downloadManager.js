/* global Buffer */
var async = require('async'),
	apiModels = require('./../models/apiModels'),
	errorModels = require('./../models/errorModels'),
	typeHelper = require('./../helpers/typeHelper'),
	dataCache = null,
	io = null;

function createDownload(downloadRequest, chunkSize, ttl, done) {
	async.waterfall([
		function(callback) {
			io.GetFileStats(downloadRequest.path, function(error, stats) {
				if(typeHelper.doesExist(error)) {
					callback(error);
				} else {
					var download = new apiModels.Download(downloadRequest, stats.size, chunkSize);
					callback(null, download);
				}
			});
		},
		function(download, callback) {
			dataCache.create(download.id, download, ttl, function(error, success) {
				if(!success) {
					callback(errorModels.ServerError());
				} else {
					callback(error, download);
				}
			});
		}
	], function(error, download) {
		done(error, download);
	});
}

function restoreDownload(downloadId, done) {
	dataCache.restore(downloadId, function(error, download) {
		if(typeHelper.doesExist(error)) {
			done(error);
		} else if (!typeHelper.doesExist(download.value)) {
			done(errorModels.DownloadMissing());
		} else {
			done(null, download.value);
		}
	});
}

function updateDownload(downloadId, index, chunkSize, ttl, done) {
	async.waterfall([
		function(callback) {
			restoreDownload(downloadId, callback);
		},
		function(download, callback) {
			download.chunks[index] = true;
			dataCache.update(download.id, download, ttl, function(error, success) {
				callback(error, download, success);
			});
		},
		function(download, success, callback) {
			if(success) {
				var buff = new Buffer(chunkSize);
				io.ReadFileChunk(download.path, buff, 0, buff.length, index * chunkSize, function(error, read, buffer) {
					callback(error, buffer);
				});
			} else {
				callback(errorModels.ServerError());
			}
		}
	], function(error, result) {
		done(error, result);
	});
}

function deleteDownload(downloadId, done) {
	async.waterfall([
		function(callback) {
			restoreDownload(downloadId, callback);
		},
		function(download, callback) {
			dataCache.delete(download.id, function(error) {
				callback(error);
			});
		}
	], function(error) {
		done(error);
	});
}

var manager = {
	createDownload: createDownload,
	restoreDownload: restoreDownload,
	updateDownload:updateDownload,
	deleteDownload: deleteDownload
};

function configure(cache, storage) {
	dataCache = cache;
	io = storage;
	
	return manager;
}

module.exports = configure;