/* global describe, it */
var should = require('should'),
	validators = require.main.require('libs/validators/chunked-upload-validators.js');
	
describe("chunked-upload-validators.js", function () {
	describe("#valid", function () {
		it('should return the signifier of a valid call', function() {
			var valid = validators.valid;
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("valid");
		});
	});
	
	describe("#validateUploadRequest", function () {
		it('should return the signifier of a valid call for a valid uploadRequest', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 1024,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("valid");
		});
		
		it('should NOT return the signifier of a valid call when passed a non-object value', function() {
			var valid = validators.validateUploadRequest(null, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload request object was not recieved.");
			
			valid = validators.validateUploadRequest(undefined, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload request object was not recieved.");
			
			valid = validators.validateUploadRequest("I am a string", 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload request object was not recieved.");
			
			valid = validators.validateUploadRequest(false, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload request object was not recieved.");
			
			valid = validators.validateUploadRequest(0, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload request object was not recieved.");
		});
		
		it('should NOT return the signifier of a valid call for an uploadRequest with a fileSize <= 0', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 0,
				chunkSize: 1024,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload fileSize must be greater than 0 bytes.");
		});
		
		it('should NOT return the signifier of a valid call for an uploadRequest with a fileSize > maxSize', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 1024,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 512);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload fileSize is greater than the maximum size of 512 bytes.");
		});
		
		it('should NOT return the signifier of a valid call for an uploadRequest with a chunkSize <= 0', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 0,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload chunkSize must be greater than 0 bytes.");
		});
		
		it('should NOT return the signifier of a valid call for an uploadRequest with a count that does not match the fileSize / chunkSize + (fileSize % chunkSize > 0 ? 1 : 0)', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 1024,
				count: 2,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload count does not match computed value, check upload file size and chunkSize.");
		});
		
		it('should NOT return the signifier of a valid call for an uploadRequest with improper parameter typing', function() {
			var valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: "1024",
				chunkSize: 1024,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload fileSize missing.");
			
			valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: "1024",
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload chunkSize missing.");
			
			valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 1024,
				count: "1",
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload count missing.");
			
			valid = validators.validateUploadRequest({
				fileName: true,
				fileSize: 1024,
				chunkSize: 1024,
				count: 1,
				destination: "/i/am/a/path/to/a/destination"
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload fileName missing.");
			
			valid = validators.validateUploadRequest({
				fileName: "woot.txt",
				fileSize: 1024,
				chunkSize: 1024,
				count: 1,
				destination: null
			}, 1024);
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("Upload destination missing.");
		});
	});
	
	describe('#validateChunkRequest', function() {
		it('should return the signifier of a valid call for a valid chunkRequest', function() {
			var valid = validators.validateChunkRequest({
				files: {
					fileIdentifier: {}
				}
			});
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("valid");
		});
		
		it('should NOT return the signifier of a valid call for a chunkRequest without files', function() {
			var valid = validators.validateChunkRequest({
				
			});
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("The chunk upload request must be of Content-Type: 'multipart/form-data', and there must be one file appended within the form.");
			valid = validators.validateChunkRequest({
				files: {}
			});
			should.exist(valid);
			valid.should.be.a.String;
			valid.should.equal("The chunk upload request must be of Content-Type: 'multipart/form-data', and there must be one file appended within the form.");
		});
	});
});