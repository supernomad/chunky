var valid = 'valid',
	typeHelper = require('./../helpers/typeHelper');

function validateUploadRequest(req, maxSize) {
	if(!typeHelper.isObject(req.body)) {
		return 'Invalid request, missing the request body.';
	} else if(!typeHelper.isString(req.body.fileName)) {
		return 'Missing the "fileName" attribute or it is not a string.';
	} else if(!typeHelper.isNumber(req.body.fileSize)) {
		return 'Missing the "fileSize" attribute or it is not a number.';
	} else if(req.body.fileSize > maxSize) {
		return 'The upload size exceeds the maximum size allowed.';
	} else {
		return valid;
	}
}

function validateUploadChunkRequest(request) {
	return valid;
}

module.exports = {
	valid: valid,
	validateUploadRequest: validateUploadRequest,
	validateUploadChunkRequest: validateUploadChunkRequest
};