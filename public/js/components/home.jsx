/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    TopBarView = require('./top/top.bar'),
    ListboardsPanelView = require('./center/listboards.panel'),
    ListboardView = require('./center/listboard'),
    ListboardSettingsView = require('./center/listboard.settings'),
    DialogItemView = require('./dialog/item.view.dialog');

var HomeView = React.createClass({  
  getInitialState: function() {
      return {
          docHeight: this.props.docHeight,
          docWidth: this.props.docWidth,
          listboards: this.props.listboards,
          selectedListboard: this.props.selectedListboard,
          selectedItem: this.props.selectedItem,
          isExtensionInstalled: this.props.isExtensionInstalled,
          listboardsVisible: this.props.listboardsVisible,
          listboardSettingsVisible: this.props.listboardSettingsVisible,
          dialogItemVisible: this.props.dialogItemVisible
      };
  },
  handleListboardClick: function(e) {
      e.preventDefault();
      page('/listboard/' + e.target.id.substring(3));
  },
  handleBodyClick: function(e) {
      if(this.state.dialogItemVisible)      
        page('/listboard/' + this.state.selectedListboard._id);
  },
  render: function() {
    this.listboardsPanelView = <ListboardsPanelView 
      visible = {this.state.listboardsVisible}
      docWidth={this.state.docWidth} 
      docHeight={this.state.docHeight} 
      handleListboardClick={ this.handleListboardClick } 
      selectedListboard= {this.state.selectedListboard} 
      isExtensionInstalled={this.state.isExtensionInstalled}
      listboards= {this.state.listboards} />

    this.listboardView = <ListboardView 
      visible = {this.state.listboardsVisible}
      docWidth={this.state.docWidth} 
      docHeight={this.state.docHeight} 
      selectedListboard= {this.state.selectedListboard} /> 

    this.listboardSettingsView = <ListboardSettingsView 
      visible = {this.state.listboardSettingsVisible}
      selectedListboard= {this.state.selectedListboard} /> 

    this.dialogItemView = this.state.dialogItemVisible? <DialogItemView 
      visible = {this.state.dialogItemVisible}
      selectedListboard= {this.state.selectedListboard}
      item={this.state.selectedItem} /> : null;

    return (
      <div onClick={this.handleBodyClick} class="wrapper">
        <div class="main-header">
          <TopBarView docWidth={this.state.docWidth} />
        </div>
        <div class="main-content">                 
            {this.listboardsPanelView}
            {this.listboardView}
            {this.listboardSettingsView}
            {this.dialogItemView}
        </div>
        <div class="main-footer">
          <small>@Listboard.it</small>
        </div>
        {this.state.dialogItemVisible? <div class="modal-backdrop fade in"></div> : null}
      </div>
    );
  }
});


module.exports.render = function (
    docHeight, 
    docWidth, 
    listboards, 
    selectedListboard, 
    selectedItem,
    isExtensionInstalled,
    listboardsVisible,
    listboardSettingsVisible,
    dialogItemVisible
  ) {
  return React.renderComponent(
    <HomeView 
      docHeight={docHeight} 
      docWidth={docWidth} 
      listboards={listboards} 
      selectedListboard={selectedListboard}
      selectedItem={selectedItem}
      isExtensionInstalled={isExtensionInstalled}
      listboardsVisible={listboardsVisible}
      listboardSettingsVisible={listboardSettingsVisible}
      dialogItemVisible={dialogItemVisible}/>,
    document.body
  );
};