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
};

var listboard1 = {
    _id: 1,
    label: 'l1',
    type: 1, //TODO not sure from which it depends
    containers: [{
        _id: 1,
        label: 'c1',
        type: 1
    },
    {
        _id: 2,
        label: 'c2',
        type: 2,
        folder: 124
    }]
};

var listboard2 = {
    _id: 2,
    label: 'l2',
    type: 1
};

state.init({ callback: function() {} });
state.loadInitialData({ folders: [folder1, folder2] });

describe('state', function() {
    describe('#loadInitialData', function() {
        describe('load folsers', function() {
            it('should load folders to internal cache collection', function() {
                state.folders.should.have.length(2);
                state.folders.byId(folder1._id).should.include(folder1);
                state.folders.byId(folder2._id).should.include(folder2);
            });

            it('should save cache of filters', function() {
                state.getFolderByFilter(new Folder(folder1).filter).should.include(folder1);
                state.getFolderByFilter(new Folder(folder2).filter).should.include(folder2);
            });

            it('should add to parent folder children reference if it is not a root folder', function() {
                var f1 = state.getFolderById(folder1._id);
                f1.children.should.have.length(1);
                f1.children.at(0).should.include(folder2);
            });

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
            });

            it('should remove folder', function() {

                state.removeFolder(folder2);

                var folder = state.getFolderById(folder2._id);

                // first we check that folder removed from state
                should(folder).not.be.ok;

                var parentFolder = state.getFolderById(folder1._id);

                //and that parent folder does not contain it
                parentFolder.children.should.have.length(0);

            });
        });

        describe('load listboards', function() {
            before(function() {
                state.removeFolder(folder1._id);
                state.removeFolder(folder2._id);

                state.loadFolders([ folder1, folder2 ]);
            });

            it('should load listboards to internal collection', function() {
                state.loadListboards([ listboard1, listboard2 ]);

                state.listboards.should.have.length(2);
                state.listboards.at(0).containers.should.have.length(listboard1.containers.length);
                state.listboards.at(0).should.include(listboard1);

                state.containers.should.have.length(2);
            });

            // this test depends from other - it is awful
            it('should return listboard by id', function() {
                state.getListboardById(listboard1._id).should.include(listboard1);
                state.getListboardById(listboard2._id).should.include(listboard2);
            });

            it('should update listboard', function() {

                state.updateListboard({
                    _id: listboard1._id,
                    label: 'll1'
                });

                var l1 = state.getListboardById(listboard1._id);
                l1.should.have.property('label', 'll1');
            });

            it('should remove listboard', function() {
                state.removeListboard(listboard1);

                var l1 = state.getListboardById(listboard1._id);

                //it is removed from lisboards
                state.listboards.should.have.length(1);

                // containers also removed
                state.containers.should.have.length(0);

                should(l1).not.be.ok;
            })
        })
    })
});

describe('Folder', function() {
    it('should have keys only attributes', function() {
        var folder = new Folder(folder1);

        folder.should.have.keys(Object.keys(folder1).concat(['children', 'items']));
    })
});