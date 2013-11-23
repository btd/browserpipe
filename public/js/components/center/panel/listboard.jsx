/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),        
    LabelEditorComponent = require('../../util/label.editor'),    
    selection = require('../../../selection/selection');

var ListboardPanel = React.createClass({ 
  saveListboardLabel: function(newLabel, success) {    
    _state.serverUpdateListboard({
      _id: this.props.listboard._id,
      label: newLabel
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent', this.refs.listboardPanel.getDOMNode()).perfectScrollbar({});
  },  
  getClassName: function() {
    return 'listboard-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
  },
  getContainerTitle: function(container) {     
    if(!container.title || container.title.trim() === '')                     
            return container.items.length + " Tabs";
    else
        return container.title;
  },
  getSubTitle: function() {
    if(this.props.listboard.type === 0)
      return <span className="sub-title">(browser - last sync 2 min ago)</span>
    else
      return <span className="sub-title">(onhold windows)</span>
  },
  render: function() {
    var self = this;  
    return (               
        <div 
            ref="listboardPanel" 
            className={ this.getClassName() } 
            onClick= { this.props.activatePanel } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner" >             
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-listboard btn" onClick={this.addEmptyListboard} href="#" title="Add empty listboard" data-toggle="tooltip">
                    <i className="icon-plus">Add container</i>
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
                  { this.props.listboard.type === 0 ? <img className="listboard-icon" draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveListboardLabel} 
                    labelValue= {this.props.listboard.label} 
                    defaultLabelValue= "Unnamed" />
                  { this.getSubTitle() }                  
                </li>                                  
              </ul>            
            </div>
          </div>          
          <div className="panel-center">
            <ul className="containers scrollable-parent">
            {                    
              this.props.listboard.containers.map(function(container) {
                  return <div>{ self.getContainerTitle(container) }</div>
              })
            }
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = ListboardPanel