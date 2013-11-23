/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('../common/item'),    
    LabelEditorComponent = require('../util/label.editor'),    
    selection = require('../../selection/selection');

var ContainerPanel = React.createClass({ 
  saveContainerLabel: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.container._id,
      title: newTitle
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent').perfectScrollbar({});
  },  
  render: function() {
    var self = this;  
    return (               
        <div className="container-panel panel">
          <div className="navbar sub-bar">
            <div className="navbar-inner">
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveContainerLabel} 
                    labelValue= {this.props.container.title} 
                    defaultLabelValue= "Unnamed" />                  
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
                    <i className="icon-plus"></i>
                  </a>
                </li>                
                <li className="divider"></li>
                <li>
                  <a draggable="false"  className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
                  </a>
                </li>
              </ul>                
            </div>
          </div>          
          <div className="container-center">
            <ul className="items scrollable-parent">
            {                    
              this.props.container.items.map(function(item) {
                  return <Item item= {item}/>
              })
            }
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = ContainerPanel