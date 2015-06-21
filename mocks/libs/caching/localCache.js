var	typeHelper = require.main.require('libs/helpers/typeHelper'),
	cache = {},
	returnValue = true;
	
function setReturnValue(retValue) {
	returnValue = retValue;
}	
function create(key, val, ttl, callback) {
	cache[key] = val;
	callback(null, returnValue);
}

function restore(key, callback) {
	callback(null, {key: key, value: cache[key]});
}

function update(key, val, ttl, callback) {
	return create(key, val, ttl, callback);
}

function del(key, callback) {
	delete cache[key];
	callback(null, 1);
}

module.exports = {
	setReturnValue: setReturnValue,
	"create": create,
	"restore": restore,
	"update": update,
	"delete": del
};