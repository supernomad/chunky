function genericErrorHandler(error, debug) {
	if(error) {
		if(debug) {
			console.error(error);
		}
		throw new Error(JSON.stringify(error));
	}
}


module.exports = {
	genericErrorHandler: genericErrorHandler	
};