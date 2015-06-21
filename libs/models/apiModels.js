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
    self.id = "";
	self.fileName = request.fileName;
	self.fileSize = request.fileSize;
	self.destination = request.destination;
	self.tempPath = "";
	self.finalPath = "";
	self.chunkSize = request.chunkSize;
	self.count = request.count;
	self.chunks = [];

	self.configure = function(id) {
		self.id = id;
		for (var i = 0; i < self.count; i++) {
			self.chunks.push(false);
		};
		self.tempPath = self.destination + '/' + self.id;
		self.finalPath = self.destination + '/' + self.fileName;
	};
}

function download(request, size, chunkSize) {
	var self = this;
	self.id = "";
	self.path = request.path;
	self.fileSize = size; 
	self.chunkSize = chunkSize;
	self.count = (size / chunkSize) + (size % chunkSize > 0 ? 1 : 0);
	self.chunks = [];
	
	self.configure = function(id) {
		self.id = id;
		for (var i = 0; i < self.count; i++) {
			self.chunks.push(false);
		}
	};
}

module.exports = {
	RouteHandler: routeHandler,
	ErrorHandler: errorHandler,
	ApiResponse: apiResponse,
	Upload: upload,
	Download: download
};