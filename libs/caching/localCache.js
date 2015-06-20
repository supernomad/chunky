var NodeCache = require('node-cache'),
	cache = new NodeCache({ stdTTL: 0, checkperiod: 300, useClones: false }),
	typeHelper = require.main.require('libs/helpers/typeHelper');

function create(key, val, ttl, callback) {
	if(typeHelper.isFunction(callback)) {
		cache.set(key, val, ttl, function (error, success) {
			callback(error, success);
		});
	} else {
		return cache.set(key, val, ttl);
	}
}

function restore(key, callback) {
	if(typeHelper.isFunction(callback)) {
		cache.get(key, function (error, value) {
			callback(error, {key: key, value: value});
		});
	} else {
		var value = cache.get(key);
		return {key: key, value: value};
	}
}

function update(key, val, ttl, callback) {
	return create(key, val, ttl, callback);
}

function del(key, callback) {
	if(typeHelper.isFunction(callback)) {
		cache.del(key, function (error, count) {
			callback(error, count);
		});
	} else {
		return cache.del(key);
	}
}

module.exports = {
	"create": create,
	"restore": restore,
	"update": update,
	"delete": del
};