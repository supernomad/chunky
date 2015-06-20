function genericErrorHandler(error, debug = false) {
	if(error) {
		if(debug) console.error(error);
		throw error;
	}
}


module.exports = {
	genericErrorHandler: genericErrorHandler	
};