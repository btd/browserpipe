var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var _state = require('models/state');
var Container = require('views/center/container/container');
var ContainerChildFolder = require('views/center/container/folder/child.folder');
var FoldersTemplate = require('templates/containers/folders');
var AddItem = require('views/center/container/item/item.add');

var FutureContainer = Container.extend({
    initializeView: function (options) {
        Container.prototype.initializeView.call(this, options);

        this.childFolderViews = [];

        this.listenFolderEvents();

        this.model.on('change:filter', this.filterChanged, this)

        this.events['click .container-folder-icon'] = 'navigateToParentFolder';
        this.events['click .add-folder-icon'] = 'addFolder';
        this.events['click .add-folder-save'] = 'saveAddFolder';
        this.events['click .add-folder-cancel'] = 'cancelAddFolder';
    },
    renderView: function () {
        this       
            .renderContainer()     
            .renderHeader()            
            .renderChildsFolders()
            .renderItems()
            .renderFooter();
        return this;
    },
    getItems: function () {
        return this.model.folder.getItems();
    },
    removeItem: function(itemView) { //overrided by future container        
        var self = this;
        itemView.model.save({
            folders: _.without(itemView.model.get('folders'), this.model.folder.getFilter())
        }, {wait: true, success: function (item) {
            self.removeItemView(itemView);
        }})        
    },
    renderFooter: function () {
        this.footer = new AddItem({ model: this.model });
        this.$('.footer').append(this.footer.render().el);
        return this;
    },
    renderChildsFolders: function () {
        var compiledTemplate = _.template(FoldersTemplate, { collapsed: this.collapsed });
        $('.box', this.el).prepend(compiledTemplate);
        //Render childs folders
        for (var i = 0, l = this.model.folder.children.length; i < l; i++) {
            var childFolder = this.model.folder.children.models[i];
            this.renderChildFolderView(childFolder);
        }
        return this;
    },
    renderChildFolderView: function (childFolder) {
        var $folders = this.$('.folders');
        var cct = new ContainerChildFolder({model: childFolder});
        $folders.append(cct.render().el);
        this.listenTo(cct, 'navigateToFolder', this.navigateToFolder);                
        this.childFolderViews.push(cct);
    },
    removeChildFolderView: function (folder) {
        var childFolderView = _.find(this.childFolderViews, function (cfv) {
            return cfv.model.id === folder.id;
        });
        if (childFolderView){     
            this.childFolderViews = _.without(this.childFolderViews, childFolderView);
            childFolderView.dispose();
        }
    },
    removeItemView: function (itemView) {
        this.model.folder.removeItem(itemView.model, {
            wait: true,
            success: function () {
                itemView.dispose();
            }
        });
    },
    listenFolderEvents: function () {
        //If a child folder is add or removed is added, we render it
        this.listenTo(this.model.folder.children, 'add', this.renderChildFolderView);
        this.listenTo(this.model.folder.children, 'remove', this.removeChildFolderView);
        //If an item is added or removed, we render it
        this.listenTo(this.model.folder.getItems(), 'add', this.itemAdded);
        this.listenTo(this.model.folder.getItems(), 'remove', this.itemRemoved);
        
    },
    filterChanged: function(){              
        var folder = _state.getFolderByFilter(this.model.get('filter'));
        if(folder) {
            this.model.folder = folder;
            //Listen to new folder events
            this.listenFolderEvents();
            //Clears content
            this.clean();
            //Render the view again
            this.render();
        }
    },
    navigateToFolder: function (folder) {
        //Unbind old folder events and item events
        this.stopListening(this.model.folder.children);
        this.stopListening(this.model.folder.getItems());
        //Sets the new folder
        this.model.save({
            title: folder.get('label'),
            filter: folder.getFilter()
        });        
    },
    navigateToParentFolder: function () {
        var parent = _state.getFolderByFilter(this.model.folder.get('path'));
        if (parent)
            this.navigateToFolder(parent);
    },
    addFolder: function () {
        this.$('.add-folder').show();
        this.$('.add-folder input').focus();
        this.scrollToAddFolder();
    },
    saveAddFolder: function () {
        var self = this;
        var label = $.trim(this.$('.add-folder input').val());
        if (label !== "") {
            this.model.folder.children.createFolder({
                label: label,
                path: this.model.folder.getFilter()
            }).then(function (folder) {
                    _state.addFolder(folder);
                    self.hideAddFolder();
                    self.$('.add-folder input').val('')
                });
        }
    },
    cancelAddFolder: function () {
        this.hideAddFolder();
    },
    hideAddFolder: function () {
        this.$('.add-folder').hide();
    },
    scrollToAddFolder: function () {
        this.$('.box').animate({scrollTop: this.$('.add-folder').offset().left + 60}, 150);
    }
});
module.exports = FutureContainer;
