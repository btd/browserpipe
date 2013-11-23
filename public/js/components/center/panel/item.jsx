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

var ItemPanel = React.createClass({ 
  saveItemLabel: function(newTitle, success) {    
    _state.serverUpdateItem({
      _id: this.props.item._id,
      title: newTitle
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent').perfectScrollbar({});
  },  
  render: function() {
    var self = this;  
    return (               
        <div className="item-panel panel">
          <div className="navbar sub-bar">
            <div className="navbar-inner">
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveItemLabel} 
                    labelValue= {this.props.item.title} 
                    defaultLabelValue= "Unnamed" />                  
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-item btn" onClick={this.addEmptyItem} href="#" title="Add empty item" data-toggle="tooltip">
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
          <div className="item-center">
            <div className="scrollable-parent">   
              Nothing here yet
            </div>
          </div>
        </div>
    );
  }
});

module.exports = ItemPanel