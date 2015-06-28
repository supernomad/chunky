var	cache = {},
	returnValue = true,
	returnErrorOnDelete = false,
	returnErrorOnCreate = false,
	returnErrorOnRestore = false;
	
function setReturnValue(retValue) {
	returnValue = retValue;
}

function setReturnErrorOnRestore(value) {
	returnErrorOnRestore = value;
}
function setReturnErrorOnCreate(value) {
	returnErrorOnCreate = value;
}
function setReturnErrorOnDelete(value) {
	returnErrorOnDelete = value;
}

function create(key, val, ttl, callback) {
	cache[key] = val;
	callback(returnErrorOnCreate ? new Error('Random failure') : null, returnValue);
}

function restore(key, callback) {
	callback(returnErrorOnRestore ? new Error('Random failure') : null, {key: key, value: cache[key]});
}

function update(key, val, ttl, callback) {
	return create(key, val, ttl, callback);
}

function del(key, callback) {
	delete cache[key];
	callback(returnErrorOnDelete ? new Error('Random failure') : null, 1);
}

module.exports = {
	setReturnValue: setReturnValue,
	setReturnErrorOnRestore: setReturnErrorOnRestore,
	setReturnErrorOnCreate: setReturnErrorOnCreate,
	setReturnErrorOnDelete: setReturnErrorOnDelete,
	'create': create,
	'restore': restore,
	'update': update,
	'delete': del
};