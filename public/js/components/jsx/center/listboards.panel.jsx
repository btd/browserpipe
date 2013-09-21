/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React');

var ListboardsPanelView = React.createClass({
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
        return  (<div class="listboards-panel" style={ this.getListboardsPanelStyle() }> 
                <ul class="listboards" style={ this.getListboardStyle() }>
                {                    
                    this.props.listboards.map(function(listboard) {
                        return <li> 
                            <a 
                            id={'li_' + listboard.id} 
                            class={self.props.selectedListboard.id === listboard.id ? "selected" : ""}
                            onClick={self.props.handleListboardClick}>
                                {listboard.get('label')}
                            </a>
                        </li > 
                    })
                }
                </ul>
        </div>);
    }
});

module.exports = ListboardsPanelView