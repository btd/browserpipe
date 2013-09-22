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
        var extensionButtonWidth = 0;
        if(!this.props.isExtensionInstalled){
            if(this.props.docWidth > 575)
                extensionButtonWidth = 306; //(270 = extension button width) + (12 = listboard padding) + (24 = listboard margin)
            else
                extensionButtonWidth = 294; //(270 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
        }
        if(this.props.docWidth > 575) //(575 = responsive design limit)
            return this.props.listboards.length * 126 + extensionButtonWidth; //(90 = listboard width) + (12 = listboard padding) + (24 = listboard margin)
        else
            return this.props.listboards.length * 114 + extensionButtonWidth; //(90 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
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
                <li class="chrome-extension-warning">
                    <a href="#installExtensionModal" data-toggle="modal">
                    You have not installed the sync extension in this browser, click here to install it
                    </a>
                </li>
            );
        else
            return null;
    },
    installChromeExtension: function() {        
        _state.installChromeExtension();
    },
    render: function() {
        var self = this;
        return  (<div class="listboards-panel" style={ this.getListboardsPanelStyle() }>                 
                <ul class="listboards" style={ this.getListboardStyle() }>
                { this.getExtensionButton() }
                {                    
                    this.props.listboards.map(function(listboard) {
                        return <li class="listboard"> 
                            <a 
                            id={'li_' + listboard.id} 
                            class={self.props.selectedListboard.id === listboard.id ? "selected" : ""}
                            onClick={self.props.handleListboardClick}>
                                {listboard.label}
                            </a>
                        </li > 
                    })
                }
                </ul>
                <div id="installExtensionModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Install Listboard.it Extension</h3>
                  </div>
                  <div class="modal-body">
                    <p>Press here</p>
                    <button onClick={this.installChromeExtension}>Install Listboard.it sync extension</button>
                  </div>
                  <div class="modal-footer">
                    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button class="btn btn-primary">Save changes</button>
                  </div>
                </div>
        </div>);
    }
});

module.exports = ListboardsPanelView