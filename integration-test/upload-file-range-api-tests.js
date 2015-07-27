/* global describe, it */
var request = require('supertest'),
	fs = require('fs'),
	async = require('async'),
	express = require('express'),
	should = require('should'),
	guidHelper = require('./../libs/helpers/guidHelper');
	
var app = express();
var range = require('./../apis/range-api.js')();
app.use(range);
var agent = request.agent(app);
var id = '';

describe("Upload a file via the range-api", function() {
	it('should create an upload using a POST request', function(done) {
		var req = {
			fileName: 'chunks.tmp',
			fileSize: 2000
		};
		
		agent.post('/range/upload')
			.send(req)
			.expect(200)
			.expect(function(res) {
				should.exist(res.body);
				res.body.should.have.keys([
					'api',
					'meta',
					'data'
				]);
				res.body.api.should.be.a.String();
				res.body.meta.should.be.an.Object();
				res.body.data.should.be.an.Object();
				
				should.exist(res.body.data.id);
				guidHelper.isGuid(res.body.data.id).should.be.true();
				id = res.body.data.id;
			})
			.end(done);
	});
	
	it('should be able to monitor the upload using GET requests using the id returned by a POST', function(done) {
		agent.get('/range/upload/' + id)
			.expect(200)
			.expect(function(res) {
				should.exist(res.body);
				res.body.should.have.keys([
					'api',
					'meta',
					'data'
				]);
				res.body.api.should.be.a.String();
				res.body.meta.should.be.an.Object();
				res.body.data.should.be.an.Object();
				
				should.exist(res.body.data.id);
				guidHelper.isGuid(res.body.data.id).should.be.true();
				res.body.data.id.should.equal(id);
			})
			.end(done);
	});
	
	it('should accept chunks of a file accompanied by a byte-range header', function(done) {
		async.series([
			function uploadChunkOne(next) {
				agent.put('/range/upload/' + id)
					.set('range', 'bytes=0-999')
					.attach('chunk', 'integration-test/fixtures/chunk0.tmp')
					.expect(200)
					.expect(function(res) {
						should.exist(res.body);
						res.body.should.have.keys([
							'api',
							'meta',
							'data'
						]);
						res.body.api.should.be.a.String();
						res.body.meta.should.be.an.Object();
						res.body.data.should.be.an.Object();
						console.log(res.body.data.chunks[0]);
						should.exist(res.body.data.id);
						guidHelper.isGuid(res.body.data.id).should.be.true();
						res.body.data.id.should.equal(id);
					})
					.end(next);
			},
			function uploadChunkTwo(next) {
				agent.put('/range/upload/' + id)
					.set('range', 'bytes=1000-1999')
					.attach('chunk', 'integration-test/fixtures/chunk1.tmp')
					.expect(200)
					.expect(function(res) {
						should.exist(res.body);
						res.body.should.have.keys([
							'api',
							'meta',
							'data'
						]);
						res.body.api.should.be.a.String();
						res.body.meta.should.be.an.Object();
						res.body.data.should.be.an.Object();
						
						should.exist(res.body.data.id);
						guidHelper.isGuid(res.body.data.id).should.be.true();
						res.body.data.id.should.equal(id);
					})
					.end(next);
			}
		], function(error) {
			done(error);
		});
	});
	
	it('the file must be preserved', function(done) {
		fs.readFile('tmp/tests/chunks.tmp', function (err, data) {
			should.not.exist(err);
			should.exist(data);
			data.should.be.an.instanceOf(Buffer);
			for(var i = 0; i < data.length; i++) {
				should.exist(data[i]);
				if(i < 1000) {
					data[i].should.equal(0);
				} else {
					data[i].should.equal(1);
				}
			}
			done();
		});
	});
});