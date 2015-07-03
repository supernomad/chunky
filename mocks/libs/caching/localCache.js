var	cache = {},
	returnValue = true,
	errorValue = null;
	
function setReturnValue(retValue) {
	returnValue = retValue;
}

function setErrorValue(shouldError) {
	errorValue = shouldError ? new Error('Random failure') : null;
}

function create(key, val, ttl, callback) {
	cache[key] = val;
	callback(errorValue, returnValue);
}

function restore(key, callback) {
	callback(errorValue, {key: key, value: cache[key]});
}

function update(key, val, ttl, callback) {
	return create(key, val, ttl, callback);
}

function del(key, callback) {
	delete cache[key];
	callback(errorValue, 1);
}

module.exports = {
	setReturnValue: setReturnValue,
	setErrorValue: setErrorValue,
	'create': create,
	'restore': restore,
	'update': update,
	'delete': del
};