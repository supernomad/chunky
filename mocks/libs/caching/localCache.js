var	typeHelper = require.main.require('libs/helpers/typeHelper'),
	cache = {};
function create(key, val, ttl, callback) {
	cache[key] = val;
	if(typeHelper.isFunction(callback)) {
			callback(null, true);
	} else {
		return true;
	}
}

function restore(key, callback) {
	if(typeHelper.isFunction(callback)) {
		callback(null, {key: key, value: cache[key]});
	} else {
		return {key: key, value: cache[key]};
	}
}

function update(key, val, ttl, callback) {
	return create(key, val, ttl, callback);
}

function del(key, callback) {
	delete cache[key];
	if(typeHelper.isFunction(callback)) {
		callback(null, 1);
	} else {
		return 1;
	}
}

module.exports = {
	"create": create,
	"restore": restore,
	"update": update,
	"delete": del
};