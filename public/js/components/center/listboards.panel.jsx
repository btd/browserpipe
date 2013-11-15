/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    extension = require('../../extension/extension'),
    page = require('page'),
    React = require('react');
    listboardSelectorDraggable = require('../../dragging/listboard.selector'),
    selection = require('../../selection/selection');

var ListboardsPanelComponent = React.createClass({    
    getListboardsPanelWidth: function() {
        return this.props.width;
    },       
    getListboardsPanelStyle: function() {
        var visible = this.props.visible? "block" : "none";
        return { width: this.getListboardsPanelWidth(), display: visible };
    },
    getExtensionButton: function() {
        if(!this.props.isExtensionInstalled)
            return (
                <a draggable="false"  className="chrome-extension-warning" href="#installExtensionModal" data-toggle="modal">
                    You have not installed the sync extension in this browser, click here to install it
                </a>
            );
        else
            return null;
    },
    installChromeExtension: function() {        
        extension.installChromeExtension();
    },
    addEmptyListboardAndSelectIt: function(e) {
        e.preventDefault();
        _state.serverSaveListboard({
            type: 1
        }, function(listboard){
            page('/listboard/' + listboard._id);
        })
    },
    isSelected: function(listboardId) {
        return selection.isListboardSelected(listboardId);
    },
    handleListboardClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.listboard-selector:first').attr('id');
        var listboardId = elementId.substring(3);
        if(e.ctrlKey){
            if(!this.isSelected(listboardId))
                selection.selectListboard(listboardId);
            else
                selection.unSelectListboard(listboardId);
        }            
        else            
            this.props.navigateToListboard(listboardId);
    }, 
    getListboardClass: function(listboard) {
        return 'listboard-selector ' +
        (this.props.selectedListboard._id === listboard._id ?  'selected ' : 'listboard-selector ') + 
        (listboard.type === 0 ? 'browser-listboard-selector ' : 'custom-listboard-selector ') +
        (this.isSelected(listboard._id)? selection.getClassName() : '');
    },
    renderListboardOption: function(listboard) {
        return <li             
            className={ this.getListboardClass(listboard) }            
            id={'li_' + listboard._id}
            draggable="true"             
            onClick={this.handleListboardClick}
            onDragStart={listboardSelectorDraggable.objDragStart} 
            onDragEnd={listboardSelectorDraggable.objDragEnd}
            onDragOver={listboardSelectorDraggable.objDragOver}
            onDragEnter={listboardSelectorDraggable.objDragEnter}
            onDragLeave={listboardSelectorDraggable.objDragLeave}
            onDrop={listboardSelectorDraggable.objDrop}
            title={listboard.label? listboard.label : 'Unnamed'}> 
                { listboard.type === 0 ? <img draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }
                <div>{listboard.label? listboard.label : 'Unnamed'}</div>
            </li > 
    },
    render: function() {
        var self = this;
        return  (
            <div className="listboards-panel" style={ this.getListboardsPanelStyle() }>                                 
                <div className="listboards">                
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
                    <a draggable="false"  className="add-listboard btn" onClick={this.addEmptyListboardAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                        <i className="icon-plus"></i>
                    </a>
                    <ul className="custom-listboards"
                        onDragOver={listboardSelectorDraggable.parentDragOver}
                        onEnter={listboardSelectorDraggable.parentDragEnter}
                        onDragLeave={listboardSelectorDraggable.parentDragLeave}
                        onDrop={listboardSelectorDraggable.parentDrop}
                    >
                    {                    
                        this.props.listboards
                            .filter(function(l) { return l.type === 1 } )
                            .map(function(listboard) {
                                return self.renderListboardOption(listboard)
                            })
                    }
                    </ul>                    
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