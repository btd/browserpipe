
exports.collectionClear = function(Collection) {
	Collection.prototype.clear = function() {
		while (this.length > 0) {
		  this.shift();
		}
	}
};
