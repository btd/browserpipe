var coverage = require('./coverage'),
		Tag = coverage.require("../app/models/tag"),
		assert = require("assert");


describe('tags', function(){
	it('should not allow creation of tags with empty label', function() {
		var tag = new Tag({ label: ''});
		tag.save(function(err) {
			assert(typeof err !== 'undefined');
		});
	});
	it('should not allow creation of tags with empty path', function() {
		var tag = new Tag({ path: ''});
		tag.save(function(err) {
			assert(typeof err !== 'undefined');
		});
	});
});
