var _state = require('models/state')

module.exports = function (socket) {

    var getListboardCollection = function (listboard) {
        switch (listboard.type) {
            case 0:
                return _state.nowListboards;
            case 1:
                return _state.laterListboards;
            case 2:
                return _state.futureListboards;
        }
    }

    var updateDifferences = function (listboard, listboardUpdate) {
        _.each(_.keys(listboardUpdate), function (key) {
            if (listboard.get(key) !== listboardUpdate[key]) {
                listboard.set(key, listboardUpdate[key]);
            }
        });
    }

    socket.on('create.listboard', function (newListboard) {
        var collection = getListboardCollection(newListboard);
        var listboard = collection.get(newListboard.cid);
        if (!listboard)
            collection.add(newListboard);
    });

    socket.on('update.listboard', function (listboardUpdate) {
        var listboard = _state.getListboard(listboardUpdate.type, listboardUpdate._id);
        if (listboard)
            updateDifferences(listboard, listboardUpdate);
    });

    //TODO: Not implemented yet the delete of listboards
    /*socket.on('delete.listboard', function (listboardUpdate) {
        listboard = _state.getListboard(listboardUpdate.type, listboardUpdate._id);
        if (listboard)
            listboard.destroy();
    });*/
};

