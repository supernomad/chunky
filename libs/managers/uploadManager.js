/* global Buffer */
var async = require('async'),
	apiModels = require('./../models/apiModels'),
	errorModels = require('./../models/errorModels'),
	typeHelper = require('./../helpers/typeHelper'),
	dataCache = null,
	io = null;

function createUpload(uploadRequest, ttl, done) {
	var upload = new apiModels.Upload(uploadRequest);

	async.waterfall([
		function(callback) {
			dataCache.create(upload.id, upload, ttl, function (error, success) {
				if(!success) {
					callback(errorModels.ServerError());
				} else {
					callback(error, upload);
				}
			});
		},
		function(upload, callback) {
			var buff = new Buffer(upload.fileSize);
			buff.fill(0);
			
			io.CreateFile(upload.tempPath, buff, 0, buff.length, function(error) {
				callback(error, upload);
			});
		}
	], function(error, upload) {
		done(error, upload);
	});
}

function restoreUpload(uploadId, done) {
	dataCache.restore(uploadId, function name(error, upload) {
		if(typeHelper.doesExist(error)) {
			done(error);
		} else if(!typeHelper.doesExist(upload.value)) {
			done(errorModels.UploadMissing());
		} else {
			done(null, upload.value);
		}
	});
}

function updateUpload(uploadId, index, file, ttl, done) {
	async.waterfall([
		function(callback) {
			dataCache.restore(uploadId, function(error, upload) {
				if(typeHelper.doesExist(error)) {
					callback(error);
				} else if(!typeHelper.doesExist(upload.value)) {
					callback(errorModels.UploadMissing());
				} else {
					callback(null, upload.value);
				}
			});
		},
		function(upload, callback) {
			upload.chunks[index] = true;
			dataCache.update(upload.Id, upload, ttl, function(error, success) {
				if(typeHelper.doesExist(error)) {
					callback(error);
				} else if(!success) {
					callback(errorModels.ServerError());
				} else {
					callback(null, upload);
				}
			});
		},
		function(upload, callback) {
			io.ReadFile(file.path, function(error, data) {
				callback(error, upload, data);
			});
		},
		function(upload, data, callback) {
			io.WriteFileChunk(upload.TempPath, data, 0, data.length, index * upload.ChunkSize, function(error) {
				callback(error, upload);
			});
		},
		function(upload, callback) {
			async.every(upload.chunks, function(item, call) {
				call(item === true);
			}, function(result) {
				callback(null, upload, result);
			});
		},
		function(upload, complete, callback) {
			if(complete) {
				async.series([
					function(call) {
						io.RenameFile(upload.TempPath, upload.FinalPath, function(error) {
							call(error);
						});
					},
					function(call) {
						dataCache.delete(upload.id, function(error) {
							call(error);
						});
					}
				], function(error) {
					callback(error, upload, complete);
				});
			} else {
				callback(null, upload, complete);
			}
		}
	], function(error, upload, complete) {
		done(error, upload, complete);
	});
}

function deleteUpload(uploadId, done) {
	async.waterfall([
		function(callback) {
			dataCache.restore(uploadId, function name(error, upload) {
				callback(error, upload);
			});
		},
		function(upload, callback) {
			dataCache.delete(upload.id, function (error) {
				callback(error, upload);
			});
		},
		function(upload, callback) {
			io.DeleteFile(upload.tempPath, function(deleteError) {
				callback(deleteError);
			});
		}
	], function(error) {
		done(error);
	});
}

var manager = {
	createUpload: createUpload,
	restoreUpload: restoreUpload,
	updateUpload: updateUpload,
	deleteUpload: deleteUpload
};

function configure(cache, storage) {
	dataCache = cache;
	io = storage;
	
	return manager;
}
module.exports = configure;