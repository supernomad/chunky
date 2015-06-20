var	typeHelper = require.main.require('libs/helpers/typeHelper'),
	cache = {};
function create(key, val, ttl, callback) {
	cache[key] = val;
	callback(null, true);
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
	"create": create,
	"restore": restore,
	"update": update,
	"delete": del
};