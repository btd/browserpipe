/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    PanelMixin = require('../../util/panel.mixin'),   
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),   
    LabelEditorComponent = require('../../util/label.editor'),    
    ItemsComponent = require('../common/items'), 
    selection = require('../../../selection/selection');

var SearchPanel = React.createClass({ 
  mixins: [PanelMixin, PanelActivatorMixin],    
  getClassName: function() {
    return 'search-panel panel' + 
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
  getSearchItems: function() {
    if(this.props.search.items.length > 0)
       return <ItemsComponent 
                items= { _state.getItemsByIds(this.props.search.items ) }
                activatePanel= { this.props.activatePanel }
                scrollable = { true } 
                navigateToItem={this.props.navigateToItem} />
    else
      return <div>No result found</div>;
  },
  render: function() {    
    return (               
        <div ref="searchPanel"   
            className={ this.getClassName() }           
            onClick= { this.handlePanelClick(this.props.activatePanel) } >
          <div className={ this.getSubBarClassName() } >
            <div className="navbar-inner">
              { this.getPanelNumber() }                       
              <ul className="nav nav-right">                 
                { this.getPanelPin() }        
              </ul>                
              <ul className="nav nav-left">                                  
                <li className="label-text" title="Search results">
                  { 'Search results for "' + this.props.search.query + '"' }
                </li>
              </ul>                            
            </div>
          </div>          
          <div className="panel-center">
            { this.getSearchItems() }
          </div>
        </div>
    );
  },
  componentDidMount: function(){    
    $('.scrollable-parent', this.refs.searchPanel.getDOMNode()).perfectScrollbar({});
  },
  componentDidUpdate: function(){    
    $('.scrollable-parent', this.refs.searchPanel.getDOMNode()).perfectScrollbar('update');
  }  
});

module.exports = SearchPanel