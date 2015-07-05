var guidHelper = require('./../helpers/guidHelper');

function routeHandler(uri, handler) {
	var self = this;
	self.uri = uri;
	self.handler = handler;
}
function errorHandler(handler) {
	var self = this;
	self.handler = handler;
}

function apiResponse(api, meta, data) {
	var self = this;
	self.api = api;
	self.meta = meta;
	self.data = data;
}

function upload(request) {
	var self = this;
    self.id = guidHelper.newGuid();
	self.fileName = request.fileName;
	self.fileSize = request.fileSize;
	self.destination = request.destination;
	self.tempPath = '';
	self.finalPath = '';
	self.chunkSize = request.chunkSize;
	self.count = request.count;
	self.chunks = [];

	for (var i = 0; i < self.count; i++) {
		self.chunks.push(false);
	};
	
	self.tempPath = self.destination + '/' + self.id;
	self.finalPath = self.destination + '/' + self.fileName;
}

function download(request, size, chunkSize) {
	var self = this;
    self.id = guidHelper.newGuid();
	self.path = request.path;
	self.fileSize = size; 
	self.chunkSize = chunkSize;
	self.count = (size / chunkSize) + (size % chunkSize > 0 ? 1 : 0);
	self.chunks = [];
	for (var i = 0; i < self.count; i++) {
		self.chunks.push(false);
	}
}

function transfer(transferType, path, fileSize, fileName) {
	var self = this;
	self.id = guidHelper.newGuid();
	self.type = transferType;
	self.name = fileName;
	self.path = path;
	self.temp = path + '/' + self.id;
	self.size = fileSize;
	self.chunks = [];
}

module.exports = {
	RouteHandler: routeHandler,
	ErrorHandler: errorHandler,
	ApiResponse: apiResponse,
	Upload: upload,
	Download: download,
	Transfer: transfer
};