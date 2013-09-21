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
        if(this.props.docWidth > 575) //(575 = responsive design limit)
            return this.props.listboards.length * 126; //(90 = listboard width) + (12 = listboard padding) + (24 = listboard margin)
        else
            return this.props.listboards.length * 114; //(90 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
    },    
    getListboardsPanelStyle: function() {
        return { width: this.getListboardsPanelWidth() };
    },
    getListboardStyle: function() {        
        return  { width: this.getListboardsWidth() };
    },
    render: function() {
        var self = this;
        return  (React.DOM.div( {className:"listboards-panel", style: this.getListboardsPanelStyle() },  
                React.DOM.ul( {className:"listboards", style: this.getListboardStyle() }, 
                                    
                    this.props.listboards.map(function(listboard) {
                        return React.DOM.li(null,  
                            React.DOM.a( 
                            {id:'li_' + listboard.id, 
                            className:self.props.selectedListboard.id === listboard.id ? "selected" : "",
                            onClick:self.props.handleListboardClick}, 
                                listboard.get('label')
                            )
                        ) 
                    })
                
                )
        ));
    }
});

module.exports = ListboardsPanelView