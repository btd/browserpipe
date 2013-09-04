var _state = require('models/state')

module.exports = function (socket) {

	var updateDifferences = function(collection, container, containerUpdate) {
		_.each(_.keys(containerUpdate), function(key) {
			if(container.get(key) !== containerUpdate[key]){
				container.set(key,  containerUpdate[key]);
				//Events is not fired automatically
				collection.trigger('change:' + key, container);
			}
		});
	}

	socket.on('create.container', function (data) {
		var listboard = _state.getListboard(data.listboardType, data.listboardId);
		if(listboard && !listboard.containers.get(data.container.cid))
			listboard.containers.add(data.container); 
	});

	socket.on('bulk.create.container', function (data) {
		var listboard = _state.getListboard(data.listboardType, data.listboardId);
		if(listboard)
			for(var index in data.containers){
				var container = data.containers[index];	
				if(!listboard.containers.get(container.cid))			
					listboard.containers.add(container); 
			}	 
	});
   
    socket.on('update.container', function (data) {
	    var listboard = _state.getListboard(data.listboardType, data.listboardId);
	    if(listboard) {
	    	var container = listboard.containers.get(data.container._id);
	    	if(container)
	    		updateDifferences(listboard.containers, container, data.container);	
	    }	    
	});

	socket.on('delete.container', function (data) {
	    var listboard = _state.getListboard(data.listboardType, data.listboardId);
	    if(listboard) {
	    	var container = listboard.containers.get(data.container._id);
	    	if(container)
	    		listboard.containers.remove(container);
	    }	    	
	});

	socket.on('bulk.delete.container', function (data) {
		var listboard = _state.getListboard(data.listboardType, data.listboardId);
		if(listboard)
			for(var index in data.containers){
				var container = data.containers[index];			    
		    	var cont = listboard.containers.get(container._id);
		    	if(cont)
		    		listboard.containers.remove(cont);
		    }	    	
	});
};

