/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    page = require('page'),
    React = require('react');

var ListboardsPanelComponent = React.createClass({    
    getListboardsPanelWidth: function() {
        return this.props.width;
    },
    getListboardsWidth: function() {
        var extensionButtonWidth = 0;
        if(!this.props.isExtensionInstalled){
            if(this.props.width > 575)
                extensionButtonWidth = 306; //(270 = extension button width) + (12 = listboard padding) + (24 = listboard margin)
            else
                extensionButtonWidth = 494; //(270 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
        }
        if(this.props.width > 575) //(575 = responsive design limit)
            return this.props.listboards.length * 126 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (24 = listboard margin) + (11 = Add buton)
        else
            return this.props.listboards.length * 114 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (12 = listboard margin)  + (11 = Add buton)
    },    
    getListboardsPanelStyle: function() {
        var visible = this.props.visible? "block" : "none";
        return { width: this.getListboardsPanelWidth(), display: visible };
    },
    getListboardStyle: function() {        
        return  { width: this.getListboardsWidth() };
    },
    getExtensionButton: function() {
        if(!this.props.isExtensionInstalled)
            return (
                <a className="chrome-extension-warning" href="#installExtensionModal" data-toggle="modal">
                    You have not installed the sync extension in this browser, click here to install it
                </a>
            );
        else
            return null;
    },
    installChromeExtension: function() {        
        _state.installChromeExtension();
    },
    addEmptyListboardAndSelectIt: function(e) {
        e.preventDefault();
        _state.serverSaveListboard({
            type: 1
        }, function(listboard){
            page('/listboard/' + listboard._id);
        })
    },
    renderListboardOption: function(listboard) {
        return <li 
            className={this.props.selectedListboard._id === listboard._id ? "listboard selected" : "listboard"}
            id={'li_' + listboard._id}
            onClick={this.props.handleListboardClick}
            title={listboard.label? listboard.label : 'Unnamed'}> 
                { listboard.type === 0 ? <img src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }
                <span>{listboard.label? listboard.label : 'Unnamed'}</span>
            </li > 
    },
    render: function() {
        var self = this;
        return  (
            <div className="listboards-panel" style={ this.getListboardsPanelStyle() }>                                 
                <div className="listboards" style={ this.getListboardStyle() }>                
                    { this.getExtensionButton() }
                    <ul className="browser-listboards">
                    {                    
                        this.props.listboards
                            .filter(function(l) {return l.type === 0 } )
                            .map(function(listboard) {
                                return self.renderListboardOption(listboard)
                            })
                    }
                    </ul>
                    <ul className="custom-listboards">
                    {                    
                        this.props.listboards
                            .filter(function(l) { return l.type === 1 } )
                            .map(function(listboard) {
                                return self.renderListboardOption(listboard)
                            })
                    }
                    </ul>
                    <a className="add-listboard btn" onClick={this.addEmptyListboardAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                        <i className="icon-plus"></i>
                    </a>
                </div>
                
                <div id="installExtensionModal" className="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Install Listboard.it Extension</h3>
                  </div>
                  <div className="modal-body">
                    <p>Press here</p>
                    <button onClick={this.installChromeExtension}>Install Listboard.it sync extension</button>
                  </div>
                  <div className="modal-footer">
                    <button className="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button className="btn btn-primary">Save changes</button>
                  </div>
                </div>
        </div>);
    }
});

module.exports = ListboardsPanelComponent