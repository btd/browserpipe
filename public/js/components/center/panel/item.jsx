/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    PanelMixin = require('../../util/panel.mixin'),   
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),     
    Item = require('../common/item'),    
    LabelEditorComponent = require('../../util/label.editor');

var ItemPanel = React.createClass({ 
  mixins: [PanelMixin, PanelActivatorMixin],
  saveItemLabel: function(newTitle, success) {    
    _state.serverUpdateItem({
      _id: this.props.item._id,
      title: newTitle
    }, success );
  },
  getClassName: function() {
    return 'item-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
  },
  getPanelNumber: function (argument) {
    if(this.props.fullWidth)
      return null
    else
      return <div 
            className={"panel-number" + (this.props.active?' selected': '')}
            title={"Select panel " + this.props.panelNumber} >            
              { this.props.panelNumber }
            </div>
  },
  render: function() {
    var self = this;  
    return (               
        <div ref="itemPanel" 
            className={ this.getClassName() } 
            onClick= { this.handlePanelClick(this.props.activatePanel) } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner" >        
              { this.getPanelNumber() }                            
              <ul className="nav nav-right">                   
                { this.getPanelPin() }
              </ul>      
              <ul className="nav nav-left">                                  
                <li>                  
                  <LabelEditorComponent 
                    activatePanel= { this.props.activatePanel }
                    onSaveLabel= {this.saveItemLabel} 
                    labelValue= {this.props.item.title} 
                    defaultLabelValue= "Unnamed" />   
                    <span className="sub-title">(url item)</span>               
                </li>                                  
              </ul>           
            </div>
          </div>          
          <div className="panel-center">
            <div className="scrollable-parent scrollable-parent-y">  
              <img className="screenshot" data-src="holder.js/360x270" alt="360x270" src="/img/item/screenshot.png" />
            </div>
          </div>
        </div>
    );
  },
  componentDidMount: function(){
    $('.scrollable-parent', this.refs.itemPanel.getDOMNode()).perfectScrollbar({});
  }, 
  componentDidUpdate: function(){
    $('.scrollable-parent', this.refs.itemPanel.getDOMNode()).perfectScrollbar('update');
  }
});

module.exports = ItemPanel