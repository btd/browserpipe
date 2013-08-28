var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var config = require('config');
var _state = require('models/state');
var Container = require('models/container');
var SectionListboard = require('views/center/listboard/section.listboard');
var LaterContainer = require('views/center/container/later.container');
var template = require('templates/later/later');

var Later = SectionListboard.extend({
    events: {                
        'click .add-container' : 'addLaterContainer'
    },
    attributes: function () {
        return {
            id: 'later'
        }
    },
    initializeView: function (options) {
        SectionListboard.prototype.initializeView.call(this, options);
        this.template = template;
        if(_state.laterListboards.length > 0)
            this.model = _state.laterListboards.at(0);        
        this.containersViews = new Array();
    },
    createContainerView: function(container) {
        return new LaterContainer({model: container});
    },
    addLaterContainer: function(){
        var self = this;
        var cont = new Container({ type: 1 });
        this.model.addContainer(cont, {
            wait: true, 
            success: function (container) {
                var cv = self.addContainerView(self.createContainerView(container));
                self.calculateInnterContainerWidth();
                self.scrollToContainer(cv);
            }
        });        
    }
});
module.exports = Later;
