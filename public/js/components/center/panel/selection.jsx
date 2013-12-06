/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    PanelMixin = require('../../util/panel.mixin'),   
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),   
    ItemsComponent = require('../common/items');

var SelectionPanel = React.createClass({ 
  mixins: [PanelMixin, PanelActivatorMixin],    
  getClassName: function() {
    return 'selection-panel panel' + 
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
  getSelectionItems: function() {
    var items = _state.getSelectedItems();
    if(items.length > 0)
       return <ItemsComponent 
                items= { items }
                selection = { this.props.selection }
                activatePanel= { this.props.activatePanel }
                scrollable = { true } 
                navigateToItem={this.props.navigateToItem} />
    else
      return <div>No items selected</div>;
  },
  render: function() {    
    return (               
        <div ref="selectionPanel"   
            className={ this.getClassName() }           
            onClick= { this.handlePanelClick(this.props.activatePanel) } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner">
              { this.getPanelNumber() }                       
              <ul className="nav nav-right">                 
                { this.getPanelPin() }        
              </ul>                
              <ul className="nav nav-left">                                  
                <li className="label-text" title="Selection">
                  Selection
                </li>
              </ul>                            
            </div>
          </div>          
          <div className="panel-center">
            { this.getSelectionItems() }
          </div>
        </div>
    );
  },
  componentDidMount: function(){    
    $('.scrollable-parent', this.refs.selectionPanel.getDOMNode()).perfectScrollbar({});
  },
  componentDidUpdate: function(){    
    $('.scrollable-parent', this.refs.selectionPanel.getDOMNode()).perfectScrollbar('update');
  }  
});

module.exports = SelectionPanel