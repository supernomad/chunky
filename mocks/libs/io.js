/* global Buffer */
var returnErrorOnGetFileStats = false;

function setReturnErrorOnGetFileStats(value) {
	returnErrorOnGetFileStats = value;
}

function getFileStats(path, callback) {
	if(path.indexOf('chunksize') !== -1) {
		callback(returnErrorOnGetFileStats ? new Error('RandomError') : null, {
			size: 1025
		});
	} else {
		callback(returnErrorOnGetFileStats ? new Error('RandomError') : null, {
			size: 1024
		});
	}
}

function createFile(path, buffer, offset, length, callback) {
	callback(null);
}

function writeFileChunk(path, buffer, offset, length, position, callback) {
	callback(null);
}

function deleteFile(path, callback) {
	callback(null);
}

function readFile(path, callback) {
	callback(null, new Buffer(0));
}

function renameFile(path, newPath, callback) {
	callback(null);
}

function readFileChunk(path, buffer, offset, length, position, callback) {	
	callback(null, buffer.length, buffer);
}

module.exports = {
	setReturnErrorOnGetFileStats: setReturnErrorOnGetFileStats,
	GetFileStats: getFileStats,
	CreateFile: createFile,
	WriteFileChunk: writeFileChunk,
	DeleteFile: deleteFile,
	ReadFile: readFile,
	ReadFileChunk: readFileChunk,
	RenameFile: renameFile
};