var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var util = require('util');
var Folders = require('collections/folders');
var _state = require('models/state');
var Item = require('models/item');
var AppView = require('views/view');
var template = require('templates/items/item.add');

var AddItem = AppView.extend({
    events: {
        "click .opt-add-item": "showForm",
        "click .add-item-save": "save",
        "click .add-item-cancel": "hideForm",        
        "keyup .item-url": "keypressed"
    },
    initializeView: function () {
    },
    renderView: function () {
        var compiledTemplate = _.template(template, {});
        $(this.el).html(compiledTemplate);
        return this;
    },
    showForm: function () {
        this.$('.add-item').show();
        this.$('.opt-add-item').hide();
    },
    hideForm: function () {      
        this.cleanErrors();    
        this.$('.opt-add-item').show();
        this.$('.add-item').hide();
    },
    save: function () {
        var self = this;
        var folders = [];
        var containers = []
        var type = this.model.get('type');
        this.cleanErrors();        
        var url = this.$('.item-url').val();
        this.validateFields(url);
        if (!this.hasErrors()) {            
            if(type === 1) //this is for later containers
                containers.push(this.model.id);
            else //type = 2 this if for future containers that use contains items by folder
                folders.push(this.model.folder.getFilter());
            //We create the folder
            var item = new Item();
            item.save({
                type: type,                
                url: url,
                containers: containers,
                folders: folders //no blanks and non repeated
            }, {wait: true, success: function (item) {
                if(type === 1)
                    self.model.addItem(item);
                else
                    _state.addItemToFolders(item);
                self.$('.item-url').val('');
                self.hideForm();
            }})
        }
    },
    cleanErrors: function () {
        this.unSetAllErrorFields(this.$(".item-url"));
    },
    validateFields: function (url) {
        if (url === '')
            this.setErrorField(this.$(".item-url"), this.$(".item-url-blank"));
        else if (!util.isValidURL(url))
            this.setErrorField(this.$(".item-url"), this.$(".item-url-invalid"));
    },
    keypressed: function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.save();
        }
    }
});
module.exports = AddItem;
