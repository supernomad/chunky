var typeHelper = require('../helpers/typeHelper');

var valid = 'valid';

function checkChunks(count, fileSize, chunkSize) {
	return count !== (fileSize / chunkSize | 0) + (fileSize % chunkSize > 0 ? 1 : 0);
}

function validateUploadRequest(uploadRequest, maxSize) {
	if(!typeHelper.isObject(uploadRequest)) {
		return 'Upload request object was not recieved.';
	} else if (!typeHelper.isString(uploadRequest.fileName)) {
		return 'Upload fileName missing.';
	} else if (!typeHelper.isNumber(uploadRequest.fileSize)) {
		return 'Upload fileSize missing.';
	} else if (uploadRequest.fileSize <= 0 || uploadRequest.fileSize > maxSize) {
		return 'Upload fileSize must be greater than 0 bytes, or less than the maximum size of ' + maxSize + ' bytes.';
	} else if (!typeHelper.isNumber(uploadRequest.chunkSize)) {
		return 'Upload chunkSize missing.';
	} else if (uploadRequest.chunkSize <= 0) {
		return 'Upload chunkSize must be greater than 0 bytes.';
	} else if (!typeHelper.isNumber(uploadRequest.count) || checkChunks(uploadRequest.count, uploadRequest.fileSize, uploadRequest.chunkSize)) {
		return 'Upload count missing, or does not match computed value, check upload file size and chunkSize.';
	} else if (!typeHelper.isString(uploadRequest.destination)) {
		return 'Upload destination missing.';
	} else {
		return valid;
	}
};

function validateChunkRequest(req) {
	if(!req.files || Object.keys(req.files).length <= 0) {
		return 'The chunk upload request must be of Content-Type: "multipart/form-data", and there must be one file appended within the form.';
	}
	else {
		return valid;
	}
};

module.exports = {
	valid: valid,
	validateUploadRequest: validateUploadRequest,
	validateChunkRequest: validateChunkRequest
};