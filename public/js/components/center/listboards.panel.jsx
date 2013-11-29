/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    extension = require('../../extension/extension'),
    page = require('page'),
    React = require('react'),
    ContainersComponent = require('./common/containers'), 
    listboardSelectorDraggable = require('../../dragging/listboard.selector'),
    selection = require('../../selection/selection');

var ListboardsPanelComponent = React.createClass({            
    installChromeExtension: function() {        
        extension.installChromeExtension();
    },
    addEmptyListboardAndSelectIt: function(e) {        
        e.preventDefault();
        var that = this;
        _state.serverSaveListboard({
            type: 1
        }, function(listboard){
            that.props.navigateToListboard(listboard._id);
        })
    },
    isListboardSelected: function(listboardId) {
        return selection.isListboardSelected(listboardId);
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
    getListboardClass: function(listboard) {
        return 'listboard-option ' +
        /*(this.props.selectedListboard._id === listboard._id ?  'selected ' : '') + */
        (listboard.type === 0 ? 'browser-listboard-option ' : 'custom-listboard-option ') +
        (this.isListboardSelected(listboard._id)? selection.getClassName() : '');
    },
    renderListboardOption: function(listboard) {
        var self = this;
        return  <div 
                    className={ this.getListboardClass(listboard) } 
                    onClick={this.handleListboardClick}
                    id={'li_' + listboard._id}
                >
                    <div className="listboard-option-type">{listboard.type === 0 ? 'browser' : 'later'}</div>
                    <div className="listboard-option-header" >
                        { listboard.type === 0 ? <img className="listboard-icon" draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }                        
                        <div className="listboard-label">{listboard.label? listboard.label : 'Group of windows'}</div>
                    </div>
                    <ContainersComponent 
                        listboard= { listboard }
                        navigateToContainer = {this.props.navigateToContainer} />
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
                                <div className="text">Sync current tabs</div>
                            </div>
                        </a>  
                        <a draggable="false"  className="add-listboard btn" onClick={this.addEmptyListboardAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                            <div className="inner">
                                <i className="icon-plus"></i>
                                <div className="text">Add tabs for later</div>
                            </div>
                        </a>  
                        {                    
                            this.props.listboards     
                                .map(function(listboard) {
                                    return self.renderListboardOption(listboard)
                                })
                        }  
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