/* global describe, it , Buffer */
var io = require('./../../libs/io'),
	should = require('should'),
	tempFile = "./tmp/tests/tmp.temp",
	renameFile = "./tmp/tests/temp-rename.temp";

describe('io.js', function() {
	describe('#CreateFile', function() {
		it('should create a file on the filesystem based on the supplied buffer at the specified path.', function(done) {
			var buffer = new Buffer(1000);
			buffer.fill(0);
			var fullyBuffered = io.CreateFile(tempFile, buffer, 0, buffer.length, function(createError) {
				should.not.exist(createError);

				io.GetFileStats(tempFile, function(statError, stats) {
					should.not.exist(statError);
					should.exist(stats);

					stats.isFile().should.be.true;
					stats.size.should.equal(1000);
										
					done();
				});
			});
			fullyBuffered.should.be.a.Boolean;
		});
	});
	
	describe('#WriteFileChunk', function() {
		it('should update a given file with the supplied buffer at the supplied position.', function(done) {
			var buffer = new Buffer(1000);
			buffer.fill(0);
			var fullyBuffered = io.WriteFileChunk(tempFile, buffer, 0, buffer.length, 500, function(updateError) {
				should.not.exist(updateError);
				io.GetFileStats(tempFile, function(statError, stats) {					
					should.not.exist(statError);
					should.exist(stats);

					stats.isFile().should.be.true;
					stats.size.should.equal(1500);
										
					done();
				});
			});
			fullyBuffered.should.be.a.Boolean;
		});
	});
	
	describe('#ReadFile', function() {
		it('should read the entire specified file.', function(done) {
			io.ReadFile(tempFile, function(readError, buffer) {
				should.not.exist(readError);
				should.exist(buffer);

				buffer.length.should.equal(1500);

				for (var i = buffer.length - 1; i >= 0; i--) {
					buffer[i].should.equal(0);
				};
				done();
			});
		});
	});
	
	describe('#ReadFileChunk', function() {
		it('should read a chunk of data from the specified file into the specified buffer within the given bounds.', function(done) {
			var buffer = new Buffer(500);
			io.ReadFileChunk(tempFile, buffer, 0, buffer.length, 500, function(readError, bytesRead, data) {
				should.not.exist(readError);
				
				bytesRead.should.equal(buffer.length);

				for (var i = data.length - 1; i >= 0; i--) {
					data[i].should.equal(0);
				};
				done();
			});
		});
	});

	describe('#RenameFile', function() {
		it('should rename the given file to the new filename supplied.', function(done) {
			io.RenameFile(tempFile, renameFile, function(renameError) {
				should.not.exist(renameError);
				io.GetFileStats(renameFile, function(statError, stats) {					
					should.not.exist(statError);
					should.exist(stats);

					stats.isFile().should.be.true;
					stats.size.should.equal(1500);
										
					done();
				});
			});
		});
	});
	
	describe('#DeleteFile', function() {
		it('should delete the given file from the filesystem.', function(done) {
			io.DeleteFile(renameFile, function(deleteError) {
				should.not.exist(deleteError);
				io.GetFileStats(renameFile, function(statError, stats) {					
					should.exist(statError);
					should.not.exist(stats);										
					done();
				});
			});
		});
	});
});