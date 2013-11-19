/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    TopBarComponent = require('./top/top.bar'),
    ListboardsPanelComponent = require('./center/listboards.panel'),
    ListboardComponent = require('./center/listboard'),
    ListboardSettingsComponent = require('./center/listboard.settings'),
    FolderPanelComponent = require('./center/folder.panel'),
    SelectionDraggable = require('./center/selection.draggable'),
    DialogItemComponent = require('./dialog/item.view.dialog');

var HomeComponent = React.createClass({  
  getInitialState: function() {
      return {
          docHeight: this.props.docHeight,
          docWidth: this.props.docWidth,
          listboards: this.props.listboards,
          selectedListboard: this.props.selectedListboard,
          selectedItem: this.props.selectedItem,
          selectedFolder: this.props.selectedFolder,
          selection: this.props.selection,
          isExtensionInstalled: this.props.isExtensionInstalled,
          listboardsVisible: this.props.listboardsVisible,
          listboardSettingsVisible: this.props.listboardSettingsVisible,
          dialogItemVisible: this.props.dialogItemVisible
      };
  },  
  getCenterHeight: function() {
    return this.state.docHeight - 46 - 21; //(47 = top bar height)(21 = footer height) (40 = scrollbars height ) 
  },
  getListboardHeight: function() {
    var height = this.getCenterHeight();
    if(this.props.docWidth > 575) //(575 = responsive design limit)
      height = height - 48; //(72 = listboard panel height)
    else
      height = height - 36 //(36 = listboard panel height)
    return height;
  },
  getCenterWidth: function() {
    //TODO: change this when collapsing the folder panel
    return this.state.docWidth - 261; //(261 = folder panel)
  },  
  navigateToListboard: function(listboardId) {
      page('/listboard/' + listboardId);
  },
  handleBodyClick: function(e) {
      if(this.state.dialogItemVisible)      
        page('/listboard/' + this.state.selectedListboard._id);
  },
  render: function() {

    this.folderPanelComponent = <FolderPanelComponent 
      folder= { this.state.selectedFolder } 
      folderPanelHeight = { this.getCenterHeight() } />  

    this.listboardsPanelComponent = <ListboardsPanelComponent 
      visible = { this.state.listboardsVisible }
      width={ this.getCenterWidth() } 
      height={ this.state.docHeight } 
      navigateToListboard={ this.navigateToListboard } 
      selectedListboard= { this.state.selectedListboard } 
      isExtensionInstalled={ this.state.isExtensionInstalled }
      listboards= { this.state.listboards } />

    this.listboardComponent = <ListboardComponent 
      visible = { this.state.listboardsVisible }
      width={ this.getCenterWidth() } 
      height={ this.getListboardHeight() } 
      selectedListboard= { this.state.selectedListboard } />     

    this.listboardSettingsComponent = <ListboardSettingsComponent 
      visible = { this.state.listboardSettingsVisible }
      selectedListboard= { this.state.selectedListboard } /> 

    this.dialogItemComponent = this.state.dialogItemVisible? <DialogItemComponent 
      visible = { this.state.dialogItemVisible }
      selectedListboard= { this.state.selectedListboard }
      item={ this.state.selectedItem } /> : null;

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent docWidth={this.state.docWidth} />
        </div>
        <div className="main-content">                 
            {this.folderPanelComponent}
            {this.listboardsPanelComponent}            
            {this.listboardComponent}
            {this.listboardSettingsComponent}
            {this.dialogItemComponent}
        </div>        
        <div className="main-footer">
          <SelectionDraggable selection={this.state.selection} />          
          <small>@Listboard.it</small>
        </div>
        {this.state.dialogItemVisible? <div className="modal-backdrop fade in"></div> : null}
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
    selectedFolder,
    selection,
    isExtensionInstalled,
    listboardsVisible,
    listboardSettingsVisible,
    dialogItemVisible
  ) {
  return React.renderComponent(
    <HomeComponent 
      docHeight={docHeight} 
      docWidth={docWidth} 
      listboards={listboards} 
      selectedListboard={selectedListboard}
      selectedItem={selectedItem}
      selectedFolder={selectedFolder}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}
      listboardsVisible={listboardsVisible}
      listboardSettingsVisible={listboardSettingsVisible}
      dialogItemVisible={dialogItemVisible}/>,
    document.getElementById('body-inner')
  );
};