var _state = require('models/state'),
	Item = require('models/item');

module.exports = function (socket) {

	socket.on('create.item', function (data) {
		setTimeout(function() {
			var item = new Item(data.item);
			_state.addItemToContainers(data.listboardType, data.listboardId, item);
	    }, 1000); 		 
	});

	socket.on('bulk.create.item', function (data) {
		setTimeout(function() {
			for(var index in data.items){
				var item = new Item(data.items[index]);
				_state.addItemToContainers(data.listboardType, data.listboardId, item);
			}								
	    }, 1000); 		 
	});



};