var app = require("../"),
		mongoose = require("mongoose"),
		Tag = mongoose.model('Tag'),
		assert = require("assert")

describe('app', function(){
  describe('tags mongoose scheme', function(){
    it('should not allow create tags with empty label', function() {
    	var tag = new Tag({ label: ''});
    	tag.save(function(err) {
    		assert(typeof err !== 'undefined');
    	});
    })
  })
})