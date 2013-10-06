var should = require('should');


var state = require('../state');

var Folder = require('../data/folder').Folder;

var folder1 = {
    path: '', //root folder
    label: 'test',
    _id: 123
};

var folder2 = {
    path: 'test', //root folder
    label: 'test2',
    _id: 124
}

state.loadInitialData({ folders: [folder1, folder2] });

describe('state', function() {
    describe('#loadInitialData', function() {
        it('should load folders to internal cache collection', function() {
            state.folders.should.have.length(2);
            state.folders.byId(folder1._id).should.include(folder1);
            state.folders.byId(folder2._id).should.include(folder2);
        })

        it('should save cache of filters', function() {
            state.getFolderByFilter(new Folder(folder1).filter).should.include(folder1);
            state.getFolderByFilter(new Folder(folder2).filter).should.include(folder2);
        })

        it('should add to parent folder children reference if it is not a root folder', function() {
            var f1 = state.getFolderById(folder1._id);
            f1.children.should.have.length(1);
            f1.children.at(0).should.include(folder2);
        })

        it('should update properties of folder', function() {
            state.updateFolder({
                _id: folder1._id,
                label: 'test123'
            });

            var folder = state.getFolderById(folder1._id);
            folder.should.include({
                label: 'test123',
                path: folder1.path
            });
        })

        it('should remove folder', function() {

            state.removeFolder(folder2._id);

            var folder = state.getFolderById(folder2._id);

            // first we check that folder removed from state
            should(folder).not.be.ok;

            var parentFolder = state.getFolderById(folder1._id);

            //and that parent folder does not contain it
            parentFolder.children.should.have.length(0);

        })
    })
});

describe('Folder', function() {
    it('should have keys only attributes', function() {
        var folder = new Folder(folder1);

        folder.should.have.keys(Object.keys(folder1).concat(['children', 'items']));
    })
});