function routeHandler(uri, handler) {
	var self = this;
	self.uri = uri;
	self.handler = handler;
}
function errorHandler(handler) {
	var self = this;
	self.handler = handler;
}

module.exports = {
	RouteHandler: routeHandler,
	ErrorHandler: errorHandler
};