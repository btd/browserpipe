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
    renderExtensionButton: function() {
        /*if(!this.props.isExtensionInstalled)
            return (
                <ul className="extension-button">
                    <li>
                        <a draggable="false"  className="chrome-extension-warning" href="#installExtensionModal" data-toggle="modal">
                            You have not installed the sync extension in this browser, click here to install it
                        </a>
                    </li>
                </ul>
            );
        else
            return null;*/
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
        if(e.ctrlKey){
            if(!this.isListboardSelected(listboardId))
                selection.selectListboard(listboardId);
            else
                selection.unSelectListboard(listboardId);
        }            
        else            
            this.props.navigateToListboard(listboardId);
    },
    handleContainerClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.container-option:first').attr('id');
        var containerId = elementId.substring(5);
        /*if(e.ctrlKey){
            if(!this.isContainerSelected(containerId))
                selection.selectListboard(containerId);
            else
                selection.unSelectListboard(containerId);
        }            
        else     */       
            this.props.navigateToContainer(containerId);
    },
    getListboardClass: function(listboard) {
        return 'listboard-option ' +
        (this.props.selectedListboard._id === listboard._id ?  'selected ' : '') + 
        (listboard.type === 0 ? 'browser-listboard-option ' : 'custom-listboard-option ') +
        (this.isListboardSelected(listboard._id)? selection.getClassName() : '');
    },
    getContainerClass: function(container) {
        return 'container-option ' +
        (this.props.selectedContainer && this.props.selectedContainer._id === container._id ?  'selected ' : '') + 
        (this.isContainerSelected(container._id)? selection.getClassName() : '');
    },
    getContainerTitle: function(container) {     
        if(!container.title || container.title.trim() === '')                     
                return container.items.length + " Tabs";
        else
            return container.title;
    },
    getContainerFavicon: function(container, index) {   
        var item = container.items[index];
        var style = {};
        if(item)
            style.backgroundImage = "url('" + item.favicon + "')"; //TODO: make sure this is secure        
        return <div className="favicon" style = {style}></div>;
    },
    getContainerFavicons: function(container) {   
        return  <div className= "favicons clearfix">
                    {this.getContainerFavicon(container, 0)}
                    {this.getContainerFavicon(container, 1)}
                    {this.getContainerFavicon(container, 2)}
                    {this.getContainerFavicon(container, 3)}
                    {this.getContainerFavicon(container, 4)}
                    {this.getContainerFavicon(container, 5)}
                </div>
    },
    renderContainerOption: function(container) {
        return <li                    
                    className={ this.getContainerClass(container) } 
                    onClick={this.handleContainerClick}
                    id={'cont_' + container._id}
                >                    
                    {this.getContainerFavicons(container)}
                    <div className="title">{this.getContainerTitle(container)}</div>
                </li>;
    },
    renderListboardOption: function(listboard) {
        var self = this;
        return  <div 
                    className={ this.getListboardClass(listboard) } 
                    onClick={this.handleListboardClick}
                    id={'li_' + listboard._id}
                >
                    <div className="listboard-option-header" >
                        { listboard.type === 0 ? <img draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }
                        <span>{listboard.label? listboard.label : 'Unnamed'}</span>
                    </div>
                    <ul className="listboard-option-containers">
                    {                    
                        listboard.containers
                            .map(function(container) {
                                return self.renderContainerOption(container)
                            })
                    }               
                    </ul>     
                </div>                   
    },
    componentDidMount: function(){
        $('.listboards-panel').perfectScrollbar({});
    },
    render: function() {
        var self = this;
        return  (
            <div  className="listboards-panel scrollable-parent" /*style={ this.getListboardsPanelStyle() }*/>                                 

                    <div className="listboards" > 
                        { this.renderExtensionButton() }                    
                        {                    
                            this.props.listboards                            
                                .map(function(listboard) {
                                    return self.renderListboardOption(listboard)
                                })
                        }
                        <a draggable="false"  className="add-listboard btn" onClick={this.addEmptyListboardAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                            <i className="icon-plus"></i>
                        </a>                                   
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
    }
});

module.exports = ListboardsPanelComponent