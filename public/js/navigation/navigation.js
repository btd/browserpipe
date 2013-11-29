var _state = require('../state'),
    page = require('page');


module.exports.navigateToOnePanel = function(type, id){
	page('/panel1/' + type + '/' + id);
}

module.exports.navigateToTwoPanels = function(type1, id1, type2, id2){
	page('/panel1/' + type1 + '/' + id1 + '/panel2/' + type2 + '/' + id2);
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