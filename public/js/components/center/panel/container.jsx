/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),  
    LabelEditorComponent = require('../../util/label.editor'),    
    ItemsComponent = require('../common/items'), 
    selection = require('../../../selection/selection');

var ContainerPanel = React.createClass({ 
  saveContainerLabel: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.container._id,
      listboardId: this.props.container.listboardId,
      title: newTitle
    }, success );
  },
  saveItem: function(url, success) {    
    var containers = [];   
    containers.push(this.props.container._id)  
    _state.serverSaveItem({       
      type: 0,
      url: url,
      containers: containers
    }, function(){
      success();
    });
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
            title={"Select panel " + this.props.panelNumber}
            onClick= { this.props.activatePanel }>
              { this.props.panelNumber }
            </div>
  },
  render: function() {    
    return (               
        <div ref="containerPanel" 
            className={ this.getClassName() } 
            onClick= { this.props.activatePanel } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner">
              { this.getPanelNumber() }                       
              <ul className="nav nav-right">                              
                <li className="dropdown">
                  <a href="#" title="Settings" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="icon-cog"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li><a tabindex="-1" href="#" onClick={ this.handleDeleteClick }>Delete</a></li>
                  </ul>
                </li>
              </ul>                
              <ul className="nav nav-left">                                  
                <li>                  
                  <LabelEditorComponent 
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
                items= { this.props.container.items }
                scrollable = { true } 
                navigateToItem={this.props.navigateToItem}
                saveItem={ this.saveItem } />
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