/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),    
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    selection = require('../../../selection/selection');

var ContainersComponent = React.createClass({ 
    isContainerSelected: function(containerId) {
        return selection.isContainerSelected(containerId);
    },
    addEmptyContainer: function(e) {      
        e.preventDefault();
        _state.serverSaveContainer({
            listboardId: this.props.listboard._id,
            type: 1,
            title: 'New Window'
        })
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
    getContainerClass: function(container) {
        return 'container-option ' +
        /*(this.props.selectedContainer && this.props.selectedContainer._id === container._id ?  'selected ' : '') + */
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
    render: function() {
        var self = this;
        return  <ul className="containers">
                {                    
                    this.props.listboard.containers
                        .map(function(container) {
                            return self.renderContainerOption(container)
                        })
                }     
                <li 
                    className="option-add-container" 
                    title={ this.props.listboard.type === 0 ? 'Open new window' : 'Add later window' }
                    onClick={ this.addEmptyContainer } >
                    <div className="inner">
                        <i className="icon-plus"></i>
                    </div>
                </li>
                </ul>                       
    }
});

module.exports = ContainersComponent