/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    PanelMixin = require('../../util/panel.mixin'),   
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),   
    LabelEditorComponent = require('../../util/label.editor'),    
    ItemsComponent = require('../common/items'), 
    selection = require('../../../selection/selection');

var ContainerPanel = React.createClass({ 
  mixins: [PanelMixin, PanelActivatorMixin],
  saveContainerLabel: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.container._id,
      listboardId: this.props.container.listboardId,
      title: newTitle
    }, success );
  },
  saveItem: function(url, success) {   
    _state.serverSaveItemToContainer(
      this.props.container.listboardId,
      this.props.container._id, 
      {       
        type: 0,
        url: url
      },
      function(){
        if(success)
          success();
      }
    );
  },
  removeItem: function(item, success) {    
    _state.serverRemoveItemFromContainer(
      this.props.container.listboardId,
      this.props.container._id, 
      item,
      function(){
        if(success)
          success();
      }
    );
  },
  handleDeleteClick: function(e) {          
      e.preventDefault();
      _state.serverRemoveContainer(this.props.container, function() {                 
      });
  },
  getClassName: function() {
    return 'container-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
  },
  getPanelNumber: function (argument) {
    if(this.props.fullWidth)
      return null;
    else
      return <div 
            className={"panel-number" + (this.props.active?' selected': '')}
            title={"Select panel " + this.props.panelNumber} >         
              { this.props.panelNumber }
            </div>
  },
  render: function() {    
    return (               
        <div ref="containerPanel" 
            className={ this.getClassName() } 
            onClick= { this.handlePanelClick(this.props.activatePanel) } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner">
              { this.getPanelNumber() }                       
              <ul className="nav nav-right">                 
                { this.getPanelPin() }        
                <li className="dropdown">
                  <a href="#" title="Settings" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="icon-cog"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li><a tabindex="-1" href="#" onClick={ this.handlePanelClick(this.handleDeleteClick) }>Delete</a></li>
                  </ul>
                </li>
              </ul>                
              <ul className="nav nav-left">                                  
                <li>                  
                  <LabelEditorComponent 
                    activatePanel= { this.props.activatePanel }
                    onSaveLabel= {this.saveContainerLabel} 
                    labelValue= {this.props.container.title} 
                    defaultLabelValue= "Unnamed" />  
                  <span className="sub-title">{this.props.container.type === 0 ? 'window' : 'later window'}</span>
                </li>                                  
              </ul>                            
            </div>
          </div>          
          <div className="panel-center">
            <ItemsComponent 
                items= { _state.getItemsByIds(this.props.container.items) }
                activatePanel= { this.props.activatePanel }
                scrollable = { true } 
                navigateToItem={this.props.navigateToItem}
                saveItem={ this.saveItem } 
                removeItem={ this.removeItem } />
          </div>
        </div>
    );
  },
  componentDidMount: function(){    
    $('.scrollable-parent', this.refs.containerPanel.getDOMNode()).perfectScrollbar({});
  },
  componentDidUpdate: function(){    
    $('.scrollable-parent', this.refs.containerPanel.getDOMNode()).perfectScrollbar('update');
  }  
});

module.exports = ContainerPanel