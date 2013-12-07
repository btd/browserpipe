/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),    
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),
    navigation = require('../../../navigation/navigation');

var ContainersComponent = React.createClass({ 
    mixins: [PanelActivatorMixin],    
    addEmptyContainer: function(e) {      
        e.preventDefault();
        _state.serverSaveContainer({
            listboardId: this.props.listboard._id,
            type: 1
        })
    },
    handleContainerClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.container-option:first').attr('id');
        var containerId = elementId.substring(5);
        navigation.navigateToContainer(containerId);             
    }, 
    getContainerTitle: function(container) {     
        if(!container.title || container.title.trim() === '')                     
                return container.items.length + " Tabs";
        else
            return container.title;
    },
    getContainerFavicon: function(container, index) {   
        var item = _state.getItemById(container.items[index]);
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
                    className='container-option'
                    onClick={ this.handlePanelClick(this.handleContainerClick) }
                    id={'cont_' + container._id}
                >                    
                    {this.getContainerFavicons(container)}
                    <div className="title">{this.getContainerTitle(container)}</div>
                </li>;
    },
    render: function() {
        var self = this;
        return  <ul className="containers"
                    activatePanel= {this.props.activatePanel}
                >
                {                    
                    this.props.listboard.containers
                        .map(function(container) {
                            return self.renderContainerOption(container)
                        })
                }     
                <li 
                    className="option-add-container" 
                    title={ this.props.listboard.type === 0 ? 'Open new window' : 'Add later window' }
                    onClick={ this.handlePanelClick(this.addEmptyContainer) } >
                    <div className="inner">
                        <i className="icon-plus"></i>
                    </div>
                </li>
                </ul>                       
    }
});

module.exports = ContainersComponent