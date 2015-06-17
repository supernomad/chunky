/* global before, process */
before(function() {
	process.stdout.write('\033c');
});