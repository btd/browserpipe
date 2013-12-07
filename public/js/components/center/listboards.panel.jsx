/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    extension = require('../../extension/extension'),
    page = require('page'),
    React = require('react'),
    listboardSelectorDraggable = require('../../dragging/listboard.selector'),
    selection = require('../../selection/selection'),
    navigation = require('../../navigation/navigation');

var ListboardsPanelComponent = React.createClass({            
    installChromeExtension: function() {        
        extension.installChromeExtension();
    },
    addEmptyContainerAndSelectIt: function(e) {        
        e.preventDefault();
        _state.serverSaveContainer({
            listboardId: this.props.laterBoard._id,
            type: 1
        }, function(container){
            navigation.navigateToContainer(container._id);
        })
    },
    isListboardSelected: function(listboardId) {
        return selection.isListboardSelected(listboardId);
    },
    isContainerSelected: function(containerId) {
        return selection.isContainerSelected(containerId);
    },
    handleListboardClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.listboard-option:first').attr('id');
        var listboardId = elementId.substring(3);                 
        navigation.navigateToListboard(listboardId);
    },
    handleContainerClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.container-option:first').attr('id');                   
        var containerId = elementId.substring(3);
        navigation.navigateToContainer(containerId);
    },
    getListboardClass: function(listboard) {        
        return 'listboard-option btn browser-listboard-option ' +
        ((
            (this.props.isPanel1Active && this.props.panel1SelectedTypeObject && (
                (this.props.panel1SelectedTypeObject.type === 'listboard' && this.props.panel1SelectedTypeObject.getObjectId() === listboard._id) ||
                (this.props.panel1SelectedTypeObject.type === 'container' && this.props.panel1SelectedTypeObject.container.listboardId === listboard._id)
            )) ||
            (!this.props.isPanel1Active && this.props.panel2SelectedTypeObject && (
                (this.props.panel2SelectedTypeObject.type === 'listboard' && this.props.panel2SelectedTypeObject.getObjectId() === listboard._id) ||
                (this.props.panel2SelectedTypeObject.type === 'container' && this.props.panel2SelectedTypeObject.container.listboardId === listboard._id)
            ))
        )? ' selected' : '') +
        (this.isListboardSelected(listboard._id)? selection.getClassName() : '');
    },
    getContainerClass: function(container) {
        return 'container-option btn custom-listboard-option ' +
        ((
            (this.props.isPanel1Active && this.props.panel1SelectedTypeObject && this.props.panel1SelectedTypeObject.type === 'container' && this.props.panel1SelectedTypeObject.getObjectId() === container._id) ||
            (!this.props.isPanel1Active && this.props.panel2SelectedTypeObject && this.props.panel2SelectedTypeObject.type === 'container' && this.props.panel2SelectedTypeObject.getObjectId() === container._id)
        )? ' selected' : '') +
        (this.isContainerSelected(container._id)? selection.getClassName() : '');
    },
    renderBrowsersListboardOption: function(listboard) {
        var self = this;
        return  <div 
                    className={ this.getListboardClass(listboard) } 
                    onClick={this.handleListboardClick}
                    id={'li_' + listboard._id}
                >
                    <div className="option-type">
                        <span>browser</span>
                        <img className="listboard-icon" draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" />                        
                    </div>
                    <div className="inner" >
                        <div className="listboard-label">{listboard.label? listboard.label : 'Group of windows'}</div>
                    </div>
                </div>                   
    },
    renderLaterContainerOption: function(container) {
        var self = this;
        return  <div 
                    className={ this.getContainerClass(container) } 
                    onClick={this.handleContainerClick}
                    id={'li_' + container._id}
                >
                    <div className="option-type">later</div>  
                    <div className="inner" >
                        <div className="container-label">{container.title? container.title : 'Unnamed'}</div>
                    </div>
                </div>     
    },
    render: function() {
        var self = this;
        return  (
            <div className="listboards-panel" >
                <div className="listboards-panel-inner scrollable-parent">                    
                    <div className="listboards" >                         
                        <a className="extension-button btn">
                            <div className="inner">
                                <i className="icon-plus"></i>
                                <div className="text">Sync this browser</div>
                            </div>
                        </a>  
                        {                    
                            this.props.listboards     
                                .map(function(listboard) {
                                    return self.renderBrowsersListboardOption(listboard)
                                })
                        }  
                        {                    
                            this.props.laterBoard.containers     
                                .map(function(container) {
                                    return self.renderLaterContainerOption(container)
                                })
                        }  
                        <a draggable="false"  className="add-later-container btn" onClick={this.addEmptyContainerAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                            <div className="inner">
                                <i className="icon-plus"></i>
                                <div className="text">Add tabs for later</div>
                            </div>
                        </a>  
                    </div>  
                </div> 
                /*<div id="installExtensionModal" className="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
                </div>*/
        </div>);
    },
    componentDidMount: function(){
        $('.listboards-panel-inner').perfectScrollbar({});
    },    
    componentDidUpdate: function(){
        $('.listboards-panel-inner').perfectScrollbar('update');
    }
});

module.exports = ListboardsPanelComponent