var should = require('should');
var _ = require('lodash');

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
        folder: folder2._id
    }]
};

var listboard2 = {
    _id: 2,
    label: 'l2',
    type: 1
};

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
                f1.children[0].should.include(folder2);
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
                state.listboards[0].containers.should.have.length(listboard1.containers.length);
                state.listboards[0].should.include(_.omit(listboard1, 'containers'));

                state.containers.should.have.length(2);
            });

            // this test depends from other - it is awful
            it('should return listboard by id', function() {
                state.getListboardById(listboard1._id).should.include(_.omit(listboard1, 'containers'));
                state.getListboardById(listboard2._id).should.include(_.omit(listboard2, 'containers'));
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
            });


        });

        describe('containers', function() {
            before(function() {
                state.removeFolder(folder1._id);
                state.removeFolder(folder2._id);

                state.loadFolders([ folder1, folder2 ]);

                state.removeListboard(listboard1);
                state.removeListboard(listboard2);

                state.loadListboards([ listboard1, listboard2 ]);
            });

            it('should be possible to update container', function() {
                // fisrt we can change label

                state.updateContainer(listboard1._id, {
                    _id: listboard1.containers[0]._id,
                    label: 'c12'
                })

                var container = state.getContainerById(listboard1.containers[0]._id);

                container.should.have.property('label', 'c12');

                state.updateContainer(listboard1._id, {
                    _id: listboard1.containers[1]._id,
                    folder: folder1._id
                });

                var container2 = state.getContainerById(listboard1.containers[1]._id);

                container2.folder.should.include(folder1);
            });

            it('should be possible to remove container', function() {
                // fisrt we can change label

                state.removeContainer(listboard1._id, listboard1.containers[0]._id);

                should(state.getContainerById(listboard1.containers[0]._id)).not.be.ok;

                state.removeContainer(listboard1._id, listboard1.containers[1]._id);

                should(state.getContainerById(listboard1.containers[1]._id));

                state.containers.should.have.length(0);
                state.getListboardById(listboard1._id).containers.should.have.length(0);
            });
        });
    });
});
