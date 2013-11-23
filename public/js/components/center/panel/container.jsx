/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('../common/item'),    
    LabelEditorComponent = require('../../util/label.editor'),    
    selection = require('../../../selection/selection');

var ContainerPanel = React.createClass({ 
  saveContainerLabel: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.container._id,
      listboardId: this.props.container.listboardId,
      title: newTitle
    }, success );
  },
  componentDidMount: function(){    
    $('.scrollable-parent', this.refs.containerPanel.getDOMNode()).perfectScrollbar({});
  },  
  getClassName: function() {
    return 'container-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
  },
  render: function() {
    var self = this;  
    return (               
        <div ref="containerPanel" 
            className={ this.getClassName() } 
            onClick= { this.props.activatePanel } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner">
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
                    <i className="icon-plus">Add item</i>
                  </a>
                </li>
                <li>
                  <a draggable="false"  className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog">Settings</i>
                  </a>
                </li>
              </ul>                
              <ul className="nav nav-left">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveContainerLabel} 
                    labelValue= {this.props.container.title} 
                    defaultLabelValue= "Unnamed" />  
                  <span className="sub-title">{this.props.container.type === 0 ? '(window)' : '(onhold window)'}</span>
                </li>                                  
              </ul>                            
            </div>
          </div>          
          <div className="panel-center">
            <ul className="items scrollable-parent">
            {                    
              this.props.container.items.map(function(item) {
                  return <Item item= {item} navigateToItem={self.props.navigateToItem} />
              })
            }
            </ul>
          </div>
        </div>
    );


     /**/
  }
});

module.exports = ContainerPanel