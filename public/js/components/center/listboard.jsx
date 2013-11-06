/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Container = require('./container'),    
    LabelEditorComponent = require('../util/label.editor');

var ListboardComponent = React.createClass({ 
  getListboardHeight: function() {
    return this.props.height - 36; //(36 = listboard subbar height)
  },
  getListboardWidth: function() {    
    return this.props.width; 
  },  
  getContainersWidth: function() {
    return this.props.selectedListboard.containers.length * 266; //(260px; = container width) + (12 = container margin)
  }, 
  saveListboardLabel: function(newLabel, success) {    
    _state.serverUpdateListboard({
      _id: this.props.selectedListboard._id,
      label: newLabel
    }, success );
  },
  addEmptyContainer: function() {      
      _state.serverSaveContainer(this.props.selectedListboard._id, {
          type: 1
      })
  },
  goToSettings: function(e) {
    page('/listboard/' + this.props.selectedListboard._id + '/settings');
    e.preventDefault();
  },
  getListboardStyle: function() {
      var visible = this.props.visible? "block" : "none";
      return { width: this.getListboardWidth(), display: visible };
  },
  render: function() {
    var self = this;  
    var containersHeight = this.getListboardHeight();
    var containersWidth = this.getContainersWidth();
    var hasHorizontalScrollbar = containersWidth > this.getListboardWidth();
    return (               
        <div className="listboard" style={this.getListboardStyle()} >
          <div className="navbar sub-bar">
            <div className="navbar-inner">
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveListboardLabel} 
                    labelValue= {this.props.selectedListboard.label} 
                    defaultLabelValue= "Unnamed" />
                  <span className="last-sync-time">(last sync 2 min ago)</span>
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a className="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
                    <i className="icon-plus"></i>
                  </a>
                </li>                
                <li className="divider"></li>
                <li>
                  <a className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
                  </a>
                </li>
              </ul>                
            </div>
          </div>          
          <div className="listboard-center" style= {{ height: this.getListboardHeight() }} >
            <ul className="containers" style= {{ width: containersWidth }} >
            {   
                this.props.selectedListboard.containers.map(function(container) {
                    return <Container 
                      container= { container } 
                      selectedListboard= { self.props.selectedListboard } 
                      containersHeight= { containersHeight } 
                      hasHorizontalScrollbar= { hasHorizontalScrollbar }/>
                })
            }
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = ListboardComponent