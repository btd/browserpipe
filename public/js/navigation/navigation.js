var _state = require('../state'),
    page = require('page');


module.exports.navigateToOnePanel = function(type, id){
	page('/panel1/' + type + '/' + id);
}

module.exports.navigateToTwoPanels = function(type1, id1, type2, id2){
	page('/panel1/' + type1 + '/' + id1 + '/panel2/' + type2 + '/' + id2);
}

module.exports.navigateToBrowser = function(){
	page('/browser');
}

module.exports.updateOnePanel = function(type, id, panel){
	if(_state.onePanel)
		this.navigateToOnePanel(type, id);
	else {
		if(panel === 1) {
			var panel2SelectedTypeObject = _state.getPanel2SelectedTypeObject();
			this.navigateToTwoPanels(
				type,
				id,
				panel2SelectedTypeObject.type,
				panel2SelectedTypeObject.getObjectId()
			);			
		}
		else {
			var panel1SelectedTypeObject = _state.getPanel1SelectedTypeObject();
			this.navigateToTwoPanels(
				panel1SelectedTypeObject.type,
				panel1SelectedTypeObject.getObjectId(),
				type,
				id
			);
		}
	}      
}

module.exports.navigateToListboard = function(listboardId) {
    this.updateOnePanel('listboard', listboardId, (_state.isPanel1Active? 1 : 2));
}

module.exports.navigateToContainer = function(containerId) {
	this.updateOnePanel('container', containerId, (_state.isPanel1Active? 1 : 2))
}

module.exports.navigateToItem = function(itemId) {
	this.updateOnePanel('item', itemId, (_state.isPanel1Active? 1 : 2))
}

module.exports.navigateToFolder = function(folderId) {
	this.updateOnePanel('folder', folderId, (_state.isPanel1Active? 1 : 2))
}

module.exports.navigateToFolderRoot = function() {
	var rootFolder = _state.getRootFolder();
	this.navigateToFolder(rootFolder._id);
}

module.exports.performSearch = function(query) {
	this.updateOnePanel('search', query, (_state.isPanel1Active? 1 : 2))
}

module.exports.navigateToItemSelection = function() {
	this.updateOnePanel('selection', 'items', (_state.isPanel1Active? 1 : 2))
}
