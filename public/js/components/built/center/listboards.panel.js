/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React');

var ListboardsPanelView = React.createClass({displayName: 'ListboardsPanelView',
    getListboardsPanelHeight: function() {
        return this.props.docHeight - 47 - 21; //(47 = top bar height) (21= footer height)
    },
    getListboardsPanelWidth: function() {
        return this.props.docWidth;
    },
    getListboardsWidth: function() {
        var extensionButtonWidth = 0;
        if(!this.props.isExtensionInstalled){
            if(this.props.docWidth > 575)
                extensionButtonWidth = 306; //(270 = extension button width) + (12 = listboard padding) + (24 = listboard margin)
            else
                extensionButtonWidth = 494; //(270 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
        }
        if(this.props.docWidth > 575) //(575 = responsive design limit)
            return this.props.listboards.length * 126 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (24 = listboard margin) + (11 = Add buton)
        else
            return this.props.listboards.length * 114 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (12 = listboard margin)  + (11 = Add buton)
    },    
    getListboardsPanelStyle: function() {
        return { width: this.getListboardsPanelWidth() };
    },
    getListboardStyle: function() {        
        return  { width: this.getListboardsWidth() };
    },
    getExtensionButton: function() {
        if(!this.props.isExtensionInstalled)
            return (
                React.DOM.a( {className:"chrome-extension-warning", href:"#installExtensionModal", 'data-toggle':"modal"}, 
" You have not installed the sync extension in this browser, click here to install it "                )
            );
        else
            return null;
    },
    installChromeExtension: function() {        
        _state.installChromeExtension();
    },
    addEmptyListboardAndSelectIt: function() {
        _state.serverSaveListboard({
            type: 1,
            label: 'Unamed'
        }, function(listboard){
            _state.setSelectedListboard(listboard._id);
        })
    },
    render: function() {
        var self = this;
        return  (
            React.DOM.div( {className:"listboards-panel", style: this.getListboardsPanelStyle() },                                  
                React.DOM.div( {className:"listboards", style: this.getListboardStyle() },                 
                     this.getExtensionButton(), 
                    React.DOM.ul(null, 
                                        
                        this.props.listboards.map(function(listboard) {
                            return React.DOM.li( 
                                {className:self.props.selectedListboard.id === listboard.id ? "listboard selected" : "listboard",
                                id:'li_' + listboard.id,                             
                                onClick:self.props.handleListboardClick},  
                                    listboard.label
                                ) 
                        })
                    
                    ),
                    React.DOM.a( {className:"add-listboard btn", onClick:this.addEmptyListboardAndSelectIt,  href:"#", title:"Add listboard", 'data-toggle':"tooltip"}, 
                        React.DOM.i( {className:"icon-plus"})
                    )
                ),
                
                React.DOM.div( {id:"installExtensionModal", className:"modal hide fade", tabindex:"-1", role:"dialog", 'aria-labelledby':"myModalLabel", 'aria-hidden':"true"}, 
                  React.DOM.div( {className:"modal-header"}, 
                    React.DOM.button( {type:"button", className:"close", 'data-dismiss':"modal", 'aria-hidden':"true"}, "×"),
                    React.DOM.h3( {id:"myModalLabel"}, "Install Listboard.it Extension")
                  ),
                  React.DOM.div( {className:"modal-body"}, 
                    React.DOM.p(null, "Press here"),
                    React.DOM.button( {onClick:this.installChromeExtension}, "Install Listboard.it sync extension")
                  ),
                  React.DOM.div( {className:"modal-footer"}, 
                    React.DOM.button( {className:"btn", 'data-dismiss':"modal", 'aria-hidden':"true"}, "Close"),
                    React.DOM.button( {className:"btn btn-primary"}, "Save changes")
                  )
                )
        ));
    }
});

module.exports = ListboardsPanelView