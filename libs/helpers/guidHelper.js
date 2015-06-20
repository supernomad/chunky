/* global process */
var typeHelper = require.main.require('libs/helpers/typeHelper');

var nanoToSeconds = function(nano) {
	return parseFloat(nano) / 1000000000;
};

var getFloatingTime = function() {
	var time = process.hrtime();
	var seconds = time[0];
	var nanoseconds = time[1];
	return parseFloat(seconds) + nanoToSeconds(nanoseconds);
};

function newGuid() {
	var d = getFloatingTime();
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return guid;
}

function isGuid(guid) {
	return typeHelper.isString(guid)
		&& /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8,9,a,b][0-9a-f]{3}-[0-9a-f]{12}$/ig.test(guid);
}

module.exports = {
	newGuid: newGuid,
	isGuid: isGuid
};