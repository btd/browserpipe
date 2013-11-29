var _state = require('../state'),
    navigation = require('../navigation/navigation');

module.exports = function (socket) {

    socket.on('create.listboard', function (newListboard) {
        _state.addListboard(newListboard);            
    });

    socket.on('update.listboard', function (listboardUpdate) {
        _state.updateListboard(listboardUpdate);
    });

    socket.on('delete.listboard', function (listboardId) {
        _state.removeListboard(listboardId);

        //if we remove it from a panel, we unset the archive
        var rootFolder = _state.getRootFolder();
        if(_state.hasPanel1SelectedTypeObject('listboard', listboardId))
            navigation.updateOnePanel('folder', rootFolder._id, 1);
        if(_state.hasPanel2SelectedTypeObject('listboard', listboardId))
            navigation.updateOnePanel('folder', rootFolder._id, 2);
    });
};

