/* global describe, it */
var should = require('should'),
	validators = require.main.require('libs/validators/chunked-download-validators.js');
	
describe('chunked-download-validators.js', function () {
	describe('#valid', function () {
		it('should return the signifier of a valid call', function() {
			var valid = validators.valid;
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('valid');
		});
	});
	
	describe('#validateDownloadRequest', function() {
		it('should return the signifier of a valid call for a valid downloadRequest', function() {
			var valid = validators.validateDownloadRequest({
				path: '/i/am/a/path/to/a/destination'
			});
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('valid');
		});
		
		it('should NOT return the signifier of a valid call when passed a non-object value', function() {
			var valid = validators.validateDownloadRequest(null);
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
			valid = validators.validateDownloadRequest(undefined);
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
			valid = validators.validateDownloadRequest(NaN);
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
			valid = validators.validateDownloadRequest(0);
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
			valid = validators.validateDownloadRequest('');
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
			valid = validators.validateDownloadRequest(true);
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download request object was not recieved, or is not an object.');
		});
		
		it('should NOT return the signifier of a valid call when passed an object with incorrectly typed, or missing parameters', function() {
			var valid = validators.validateDownloadRequest({
			});
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download path missing or it is not a string.');
			
			valid = validators.validateDownloadRequest({
				path: true
			});
			should.exist(valid);
			valid.should.be.a.String();
			valid.should.equal('Download path missing or it is not a string.');
		});
	});
});