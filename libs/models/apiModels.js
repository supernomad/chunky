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

module.exports = {
	RouteHandler: routeHandler,
	ErrorHandler: errorHandler,
	ApiResponse: apiResponse,
	Upload: upload
};