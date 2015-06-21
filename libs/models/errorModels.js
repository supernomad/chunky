function GenericError(code, error, message) {
	var self = this;
	self.Code = code;
	self.Error = error;
	self.Message = message;
}

function uploadMissing() {
	return new GenericError(404, "Missing Upload Error", "The upload specified could not be found, please check the supplied id and try again.");
}

function downloadMissing() {
	return new GenericError(404, "Missing Download Error", "The download specified could not be found, please check the supplied id and try again.");
}

function serverError() {
	return new GenericError(500, "Internal Server Error", "There has been an internal server error, so things are basically blowing up in our datacenter. We will get back to you in a minute but go ahead and try again.");
}

function validationError(msg) {
	return new GenericError(400, "Validation Error", msg);
}

module.exports = {
	GenericError: GenericError,
	UploadMissing: uploadMissing,
	DownloadMissing: downloadMissing,
	ServerError: serverError,
	ValidationError: validationError
};