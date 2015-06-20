function GenericError(code, error, message) {
	self.Code = code;
	self.Error = error;
	self.Message = message;
}

function missingCacheItem() {
	this = new GenericError(404, "Missing Upload Error", "The upload specified could not be found, please check the supplied id and try again.");
}

function serverError() {
	this = new GenericError(500, "Internal Server Error", "There has been an internal server error, so things are basically blowing up in our datacenter. We will get back to you in a minute but go ahead and try again.");
}

function validationError(msg) {
	this = new GenericError(400, "Validation Error", msg);
}

module.exports = {
	GenericError: GenericError,
	MissingCacheItem: missingCacheItem,
	ServerError: serverError,
	ValidationError: validationError
};