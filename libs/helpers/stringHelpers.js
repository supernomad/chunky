var typeHelpers = require('./typeHelpers');

function stripTrailingSlashes(str) {
	if(!typeHelpers.isString(str)) return str;
	// Match any trailing slash, both '\' and '/', in any quantity as long as they are the last characters in the string.
	return str.replace(/[\\\/]+$/g, "");
}

function stripLeadingSlashes(str) {
	if(!typeHelpers.isString(str)) return str;
	// Match any leading slash, both '\' and '/', in any quantity as long as they are the first characters in the string.
	return str.replace(/^[\\\/]+/g, "");	
}

module.exports = {
	stripTrailingSlashes: stripTrailingSlashes,
	stripLeadingSlashes: stripLeadingSlashes
};