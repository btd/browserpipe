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

    var updateDifferences = function (collection, listboard, listboardUpdate) {
        _.each(_.keys(listboardUpdate), function (key) {
            if (listboard.get(key) !== listboardUpdate[key]) {
                listboard.set(key, listboardUpdate[key]);
                //Events is not fired automatically
                collection.trigger('change:' + key, listboard);
            }
        });
    }

    socket.on('create.listboard', function (listboard) {
        var collection = getListboardCollection(listboard);
        if (!collection.get(listboard.cid))
            collection.add(listboard);
    });

    socket.on('update.listboard', function (listboardUpdate) {
        var listboard = _state.getListboard(listboard.type, listboard._id);
        if (listboard)
            updateDifferences(collection, listboard, listboardUpdate);
    });

    socket.on('delete.listboard', function (listboard) {
        listboard = _state.getListboard(listboard.type, listboard._id);
        if (listboard)
            listboard.destroy();
    });
};

