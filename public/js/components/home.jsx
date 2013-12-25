/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    TopBarComponent = require('./top/top.bar'),
    ListboardsPanelComponent = require('./center/listboards.panel'),
    selection = require('../selection/selection'),
    navigation = require('../navigation/navigation');

var ItemsPanel = require('./center/panel/items');

var HomeComponent = React.createClass({    
  getInitialState: function() {
      return {     
          //isPanel1Active: _state.isPanel1Active,
          //panelPinnedNumber: 0,
          laterBoard: this.props.laterBoard,
          listboards: this.props.listboards,
          //onePanel: this.props.onePanel,
          selected1: this.props.selected1,
          selected2: this.props.selected2,
          selection: this.props.selection,
          isExtensionInstalled: this.props.isExtensionInstalled
      };
  },

  itemsPanel: function(num, obj, wide) {
    return <ItemsPanel
            num={num}
            obj={obj}
            wide={wide} />;
  },

  render: function() {
    var listboardsPanel = <ListboardsPanelComponent
      selected1= { this.state.selected1 }
      selected2= { this.state.selected2 }
      isExtensionInstalled={ this.state.isExtensionInstalled }
      laterBoard = { this.state.laterBoard }
      listboards= { this.state.listboards } />

    var panel1, panel2;

    if(this.state.selected1) {
        //load panel1
        panel1 = this.itemsPanel(1, this.state.selected1, this.state.selected2 == null);
    }

    if(this.state.selected2) {
        //load panel2
        panel2 = this.itemsPanel(2, this.state.selected2, false);
    }

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent 
            switchPanels = { this.switchPanels }                
            onePanel = { this.state.onePanel } 
            performSearch = { this.performSearch } />  
          { listboardsPanel }
        </div>
        <div className="main-content">
          {panel1}
          {panel2}
        </div>
        <div className="main-footer">
          <small>@Listboard.it</small>
        </div>
        {this.state.dialogItemVisible? <div className="modal-backdrop fade in"></div> : null}
      </div>
    );
  }
});


module.exports.render = function (
    laterBoard,
    listboards,
    selected1,
    selected2,
    selection,
    isExtensionInstalled
  ) {
  return React.renderComponent(
    <HomeComponent 
      laterBoard={laterBoard}
      listboards={listboards}
      selected1={selected1}
      selected2={selected2}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}/>,
    document.getElementById('body-inner')
  );
};