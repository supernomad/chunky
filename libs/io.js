var fs = require('fs');

function getFileStats(path, callback) {
	fs.stat(path, function(error, stats) {
		callback(error, stats);
	});
}

function createFile(path, buffer, offset, length, callback) {
	var stream = getWriteStream(path, 0, 'w');
	return stream.write(buffer.slice(offset, offset + length), function(error) {
		stream.end();
		callback(error);
	});
}

function writeFileChunk(path, buffer, offset, length, position, callback) {
	var stream = getWriteStream(path, position, 'r+');
	return stream.write(buffer.slice(offset, offset + length), function(error) {
		stream.end();
		callback(error);
	});
}

function deleteFile(path, callback) {
	fs.unlink(path, function(error) {
		callback(error);
	});
}

function readFile(path, callback) {
	fs.readFile(path, function(error, data){
		callback(error, data);
	});
}

function readFileChunk(path, buffer, offset, length, position, callback) {	
	var fd = fs.openSync(path, 'r+');
	fs.read(fd, buffer, offset, length, position, function(error, read, buffer){
		fs.closeSync(fd);
		callback(error, read, buffer);
	});
}

function renameFile(path, newPath, callback) {
	fs.rename(path, newPath, function(error) {
		callback(error);
	});
}

function getWriteStream(path, position, type) {
	return fs.createWriteStream(path, { 
		flags: type,
		mode: 0666,
		start: position
	});
}

module.exports = {
	GetFileStats: getFileStats,
	CreateFile: createFile,
	WriteFileChunk: writeFileChunk,
	DeleteFile: deleteFile,
	ReadFile: readFile,
	ReadFileChunk: readFileChunk,
	RenameFile: renameFile
};