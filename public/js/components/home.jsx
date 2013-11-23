/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    TopBarComponent = require('./top/top.bar'),
    ListboardsPanelComponent = require('./center/listboards.panel'),
    ListboardPanel = require('./center/panel/listboard'),
    ContainerPanel = require('./center/panel/container'),
    ItemPanel = require('./center/panel/item'),
    FolderPanel = require('./center/panel/folder'),
    SelectionDraggable = require('./center/selection.draggable');    

var HomeComponent = React.createClass({  
  getInitialState: function() {
      return {
          isPanel1Active: true,
          listboards: this.props.listboards,
          panel1SelectedObject: this.props.panel1SelectedObject,
          panel2SelectedObject: this.props.panel2SelectedObject,
          selection: this.props.selection,
          isExtensionInstalled: this.props.isExtensionInstalled
      };
  },  
  navigateToTypeId: function(type, id){
    //Check if there is a second panel
    if(this.state.panel2SelectedObject){
      if(this.state.isPanel1Active)
        page('/panel1/' + type + '/' + id + '/panel2/' + this.state.panel2SelectedObject.type + '/' + this.state.panel2SelectedObject._id);
      else
        page('/panel1/' + this.state.panel1SelectedObject.type + '/' + this.state.panel1SelectedObject._id + '/panel2/' + type + '/' + id + );
    }
    else
      page('/panel1/' + type + '/' + id);
  }
  navigateToListboard: function(listboardId) {
    navigateToTypeId('listboard', listboardId);
  },
  navigateToContainer: function(containerId) {
    navigateToTypeId('container', containerId);
  },
  navigateToItem: function(itemId) {
    navigateToTypeId('item', itemId);
  },
  navigateToFolder: function(folderId) {
    navigateToTypeId('folder', folderId);
  },
  activatePanel1: function(){
    if(!this.state.isPanel1Active)
      this.setState({ this.state.isPanel1Active : true });
  },
  activatePanel2: function(){
    if(this.state.isPanel1Active)
      this.setState({ this.state.isPanel1Active : false });
  },
  getSelectedComponent: function(type, id, fullWidth, active, activatePanel){
    switch(type){
        case 'listboard' : {                
            var listboard = _state.getListboardById(id);
            if(listboard)
                return <ListboardPanel 
                  listboard= { listboard } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
                  navigateToContainer = { navigateToContainer } />;
            break;
        }
        case 'container' : {                
            var container = _state.getListboardContainerById(id);
            if(container)
                return <ContainerPanel 
                  container= { container } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
                  navigateToItem = { navigateToItem } />;
            break;
        }
        case 'item' : {                
            var item = _state.getItemListboardById(id);
            if(item)
                return <ItemPanel 
                  item= { item } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } />;
            break;
        }
        case 'folder' : {                
            var folder = _state.getFolderById(id);
            if(folder)
                return <FolderPanel 
                  folder= { folder } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
                  navigateToItem = { navigateToItem } 
                  navigateToFolder = { navigateToFolder } />;
            break;
        }
    }    
  },
  render: function() {

    this.listboardsPanelComponent = <ListboardsPanelComponent       
      navigateToListboard={ this.navigateToListboard } 
      navigateToContainer={ this.navigateToContainer } 
      isPanel1Active={ isPanel1Active }
      panel1SelectedObject= { this.state.panel1SelectedObject } 
      panel2SelectedObject= { this.state.panel2SelectedObject } 
      isExtensionInstalled={ this.state.isExtensionInstalled }
      listboards= { this.state.listboards } />
    
    if(this.state.panel1SelectedObject && this.state.panel2SelectedObject) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedObject, false, isPanel1Active, activatePanel1);
      this.panel2 = this.getSelectedComponent(this.state.panel2SelectedObject, false, !isPanel1Active, activatePanel2);
    }
    else if(this.state.panel1SelectedObject) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedObject, true, isPanel1Active, activatePanel1);
      this.panel2 = null;
    }
    else if(this.state.panel2SelectedObject) {
      this.panel1 = this.getSelectedComponent(this.state.panel2SelectedObject, true, isPanel1Active, activatePanel1);
      this.panel2 = null; 
    }
    else {
      this.panel1 = <div>Nothing selected</div>;
      this.panel2 = null;
    }

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent docWidth={this.state.docWidth} />  
          {this.listboardsPanelComponent}      
        </div>
        <div className="main-content">
          {this.panel1}
          {this.panel2}
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
    listboards, 
    panel1SelectedObject,
    panel2SelectedObject,
    selection,
    isExtensionInstalled
  ) {
  return React.renderComponent(
    <HomeComponent 
      listboards={listboards} 
      panel1SelectedObject = {panel1SelectedObject}
      panel2SelectedObject={panel2SelectedObject}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}/>,
    document.getElementById('body-inner')
  );
};