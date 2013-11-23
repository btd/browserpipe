/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),        
    LabelEditorComponent = require('../util/label.editor'),    
    selection = require('../../selection/selection');

var ListboardPanel = React.createClass({ 
  saveListboardLabel: function(newLabel, success) {    
    _state.serverUpdateListboard({
      _id: this.props.listboard._id,
      label: newLabel
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent').perfectScrollbar({});
  },  
  render: function() {
    var self = this;  
    return (               
        <div className="listboard-panel panel">
          <div className="navbar sub-bar">
            <div className="navbar-inner">
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveListboardLabel} 
                    labelValue= {this.props.listboard.label} 
                    defaultLabelValue= "Unnamed" />
                  <span className="last-sync-time">(last sync 2 min ago)</span>
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-listboard btn" onClick={this.addEmptyListboard} href="#" title="Add empty listboard" data-toggle="tooltip">
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
          <div className="listboard-center">
            <ul className="containers scrollable-parent">
            {                    
              this.props.listboard.containers.map(function(container) {
                  return <div>{ container.label }</div>
              })
            }
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = ListboardPanel