/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),        
    LabelEditorComponent = require('../../util/label.editor'),    
    ContainersComponent = require('../common/containers'), 
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
  getSubTitle: function() {
    if(this.props.listboard.type === 0)
      return <span className="sub-title">(browser - last sync 2 min ago)</span>
    else
      return <span className="sub-title">(onhold windows)</span>
  },
  getPanelNumber: function (argument) {
    if(this.props.fullWidth)
      return null
    else
      return <div 
            className={"panel-number" + (this.props.active?' selected': '')}
            title={"Select panel " + this.props.panelNumber}
            onClick= { this.props.activatePanel }>
              { this.props.panelNumber }
            </div>
  },
  render: function() {
    var self = this;  
    return (               
        <div 
            ref="listboardPanel" 
            className={ this.getClassName() } 
          >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner" >    
              { this.getPanelNumber() }                       
              <ul className="nav pull-right">   
                <li>
                  <a draggable="false" title="Settings" className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
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
            <div className="scrollable-parent scrollable-parent-y">
              <ContainersComponent 
                listboard= { this.props.listboard }
                navigateToContainer = {this.props.navigateToContainer} />
            </div>
          </div>
        </div>
    );
  }
});

module.exports = ListboardPanel