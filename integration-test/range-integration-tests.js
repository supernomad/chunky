/* global describe, it, __dirname */
var request = require('supertest'),
	express = require('express'),
	should = require('should'),
	guidHelper = require('./../libs/helpers/guidHelper');
	
var app = express();
var range = require('./../apis/range-api.js')();
app.use(range);
var agent = request.agent(app);
var id = '';

describe('range-api', function() {
	it('should work', function(done) {
		var req = {
			fileName: 'woot.jpg',
			fileSize: 1000
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
	
	it('should continue working', function(done) {
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
			})
			.end(done);
	});
	it('should indeed still work', function(done) {
		agent.put('/range/upload/' + id)
			.set('range', 'bytes=0-999')
			.attach('chunk', 'integration-test/fixtures/chunk.tmp')
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
			})
			.end(done);
	});
});