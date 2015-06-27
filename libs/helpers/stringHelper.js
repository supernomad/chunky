var typeHelper = require.main.require('libs/helpers/typeHelper');

function stripTrailingSlashes(str) {
	if(!typeHelper.isString(str)) return str;
	// Match any trailing slash, both '\' and '/', in any quantity as long as they are the last characters in the string.
	return str.replace(/[\\\/]+$/g, '');
}

function stripLeadingSlashes(str) {
	if(!typeHelper.isString(str)) return str;
	// Match any leading slash, both '\' and '/', in any quantity as long as they are the first characters in the string.
	return str.replace(/^[\\\/]+/g, '');	
}

module.exports = {
	stripTrailingSlashes: stripTrailingSlashes,
	stripLeadingSlashes: stripLeadingSlashes
};