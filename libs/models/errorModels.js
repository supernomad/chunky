function genericError(code, error, message) {
	self.Code = code;
	self.Error = error;
	self.Message = message;
}

function missingCacheItem() {
	this = new genericError(404, "Missing Upload", "The upload specified could not be found, please check the supplied id and try again.");
}

function serverError() {
	this = new genericError(500, "Internal Server Error", "There has been an internal server error, so things are basically blowing up in our datacenter. We will get back to you in a minute but go ahead and try again.");
}

module.exports = {
	GenericError: genericError,
	MissingCacheItem: missingCacheItem,
	ServerError: serverError
};