var moco = require('moco'),
    model = moco.model,
    Item = require('./item').Item;

var TypeObject = model()
    .attr('type') // type of object: listboard, folder, container, item
    //TODO this should be something like this
    //.attr('object', { Model }) // object
    //For now we put different attr
    //.attr('container', { model: Container }) // Container object
    .attr('item', { model: Item }) // item object
    //.attr('folder', { model: Folder }) // Folder object
    .attr('search')
    .use(model.nestedObjects)
    .use(function(Model) { 
		Model.prototype.getObjectId = function() {
			switch(this.type){
	            case 'listboard' : return (this.listboard? this.listboard._id : null);
	            case 'container' : return (this.container? this.container._id : null);
	            case 'item' : return (this.item? this.item._id : null);
	            case 'folder' : return (this.folder? this.folder._id : null);
                case 'search' : return (this.search? this.search.query : null);
                case 'selection' : return 'items';
	        }
	        return null;
		}
	});

module.exports.TypeObject = TypeObject;