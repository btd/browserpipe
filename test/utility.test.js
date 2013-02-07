var _ = require('lodash'),
		expect = require('expect.js'),
		bcrypt = require('bcrypt');

describe('bcrypt', function() {
	it('should not have empty hash when password empty', function() {
		var hash = bcrypt.hashSync('', 8);
		expect(hash).not.to.be('');
	});
});

describe('_.isEmpty', function() {
	it('should return true for null, undefined, 0, {}, [], ""', function() {
		expect(_.isEmpty(null)).to.be(true);
		expect(_.isEmpty(undefined)).to.be(true);
		expect(_.isEmpty(0)).to.be(true);
		expect(_.isEmpty({})).to.be(true);
		expect(_.isEmpty([])).to.be(true);
		expect(_.isEmpty('')).to.be(true);
	});
});