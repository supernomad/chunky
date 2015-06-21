var typeHelper = require.main.require('libs/helpers/typeHelper');

var valid = "valid";

function validateDownloadRequest(downloadRequest) {
	if(!typeHelper.isObject(downloadRequest)) {
		return "Download request object was not recieved, or is not an object.";
	} else if (!typeHelper.isString(downloadRequest.path)) {
		return "Download path missing or it is not a string.";
	} else {
		return valid;
	}
}

module.exports = {
	valid: valid,
	validateDownloadRequest: validateDownloadRequest
};