/* global Buffer */
var fileSize = 1024,
	errorValue = null;

function setFileSize(size) {
	fileSize = size;
}

function setErrorValue(shouldError) {
	errorValue = shouldError ? new Error('Random Error') : null; 
}

function getFileStats(path, callback) {
	callback(errorValue, { size: fileSize });
}

function createFile(path, buffer, offset, length, callback) {
	callback(errorValue);
}

function writeFileChunk(path, buffer, offset, length, position, callback) {
	callback(errorValue);
}

function deleteFile(path, callback) {
	callback(errorValue);
}

function readFile(path, callback) {
	callback(errorValue, new Buffer(0));
}

function renameFile(path, newPath, callback) {
	callback(errorValue);
}

function readFileChunk(path, buffer, offset, length, position, callback) {
	callback(errorValue, buffer.length, buffer);
}

module.exports = {
	setFileSize: setFileSize,
	setErrorValue: setErrorValue,
	GetFileStats: getFileStats,
	CreateFile: createFile,
	WriteFileChunk: writeFileChunk,
	DeleteFile: deleteFile,
	ReadFile: readFile,
	ReadFileChunk: readFileChunk,
	RenameFile: renameFile
};