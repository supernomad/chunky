function doesExist(obj) {
	return obj !== null && obj !== undefined;
}

function isObject(obj) {
	return doesExist(obj) && typeof obj === "object";
}

function isFunction(obj) {
	return doesExist(obj) && Object.prototype.toString.call(obj) === '[object Function]';
}

function isString(obj) {
	return doesExist(obj) && typeof obj === "string";
}

function isBoolean(obj) {
	return doesExist(obj) && typeof obj === "boolean";
}

function isNumber(obj) {
	return doesExist(obj) && !isNaN(obj) && typeof obj === "number";
}

function isType(obj, typ) {
	return obj instanceof typ;
}

module.exports = {
	doesExist: doesExist,
	isObject: isObject,
	isFunction: isFunction,
	isString: isString,
	isNumber: isNumber,
	isBoolean: isBoolean,
	isType: isType
};