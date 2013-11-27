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
          onePanel: this.props.onePanel,
          panel1SelectedTypeObject: this.props.panel1SelectedTypeObject,
          panel2SelectedTypeObject: this.props.panel2SelectedTypeObject,
          selection: this.props.selection,
          isExtensionInstalled: this.props.isExtensionInstalled
      };
  },  
  switchPanels: function(){  
    if(this.state.onePanel){  //Open second panel
      if(this.state.panel2SelectedTypeObject)
        page('/panel1/' + this.state.panel1SelectedTypeObject.type + '/' + this.state.panel1SelectedTypeObject.getObjectId() + '/panel2/' + this.state.panel2SelectedTypeObject.type + '/' + this.state.panel2SelectedTypeObject.getObjectId());
      else
        page('/panel1/' + this.state.panel1SelectedTypeObject.type + '/' + this.state.panel1SelectedTypeObject.getObjectId() + '/panel2/' + this.state.panel1SelectedTypeObject.type + '/' + this.state.panel1SelectedTypeObject.getObjectId());
      return true;
    }
    else { //Close one panel      
       if(this.state.isPanel1Active)
        page('/panel1/' + this.state.panel1SelectedTypeObject.type + '/' + this.state.panel1SelectedTypeObject.getObjectId());
      else
        page('/panel1/' + this.state.panel2SelectedTypeObject.type + '/' + this.state.panel2SelectedTypeObject.getObjectId());
      return true;
    }
  },
  navigateToTypeObject: function(type, id){
    if(this.state.onePanel)
      page('/panel1/' + type + '/' + id);
    else {
      if(this.state.isPanel1Active)
        page('/panel1/' + type + '/' + id + '/panel2/' + this.state.panel2SelectedTypeObject.type + '/' + this.state.panel2SelectedTypeObject.getObjectId());
      else
        page('/panel1/' + this.state.panel1SelectedTypeObject.type + '/' + this.state.panel1SelectedTypeObject.getObjectId() + '/panel2/' + type + '/' + id);
    }      
  },
  navigateToListboard: function(listboardId) {
    this.navigateToTypeObject('listboard', listboardId);
  },
  navigateToContainer: function(containerId) {
    this.navigateToTypeObject('container', containerId);
  },
  navigateToItem: function(itemId) {
    this.navigateToTypeObject('item', itemId);
  },
  navigateToFolder: function(folderId) {
    this.navigateToTypeObject('folder', folderId);
  },
  navigateToFolderRoot: function() {
    var rootFolder = _state.getRootFolder();
    this.navigateToFolder(rootFolder._id);
  },
  activatePanel1: function(){
    if(!this.state.isPanel1Active)
      this.setState({ isPanel1Active : true });
  },
  activatePanel2: function(){
    if(this.state.isPanel1Active)
      this.setState({ isPanel1Active : false });
  },
  getSelectedComponent: function(typeobject, fullWidth, panelNumber, active, activatePanel){    
    switch(typeobject.type){
        case 'listboard' : {                
            var listboard = typeobject.listboard;            
            if(listboard)
                return <ListboardPanel 
                  listboard= { listboard } 
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  navigateToContainer = { this.navigateToContainer } />;
            break;
        }
        case 'container' : {                
            var container = typeobject.container;            
            if(container)
                return <ContainerPanel 
                  container= { container } 
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  navigateToItem = { this.navigateToItem } />;
            break;
        }
        case 'item' : {                
            var item = typeobject.item; 
            if(item)
                return <ItemPanel 
                  item= { item } 
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } />;
            break;
        }
        case 'folder' : {                
            var folder = typeobject.folder; 
            if(folder)
                return <FolderPanel 
                  folder= { folder } 
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  navigateToItem = { this.navigateToItem } 
                  navigateToFolder = { this.navigateToFolder } />;
            break;
        }
    }    
  },
  render: function() {
    this.listboardsPanelComponent = <ListboardsPanelComponent         
      navigateToListboard={ this.navigateToListboard } 
      navigateToContainer={ this.navigateToContainer }       
      isPanel1Active={ this.state.isPanel1Active }
      panel1SelectedTypeObject= { this.state.panel1SelectedTypeObject } 
      panel2SelectedTypeObject= { this.state.panel2SelectedTypeObject } 
      isExtensionInstalled={ this.state.isExtensionInstalled }
      listboards= { this.state.listboards } />
    
    if(!this.state.onePanel) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedTypeObject, false, 1, this.state.isPanel1Active, this.activatePanel1);
      this.panel2 = this.getSelectedComponent(this.state.panel2SelectedTypeObject, false, 2, !this.state.isPanel1Active, this.activatePanel2);
    }
    else if(this.state.panel1SelectedTypeObject) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedTypeObject, true, 1, true, this.activatePanel1);
      this.panel2 = null;
    }
    else if(this.state.panel2SelectedTypeObject) {
      this.panel1 = this.getSelectedComponent(this.state.panel2SelectedTypeObject, true, 1, true, this.activatePanel1);
      this.panel2 = null; 
    }
    else {
      this.panel1 = <div>Nothing selected</div>;
      this.panel2 = null;
    }

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent 
            switchPanels = { this.switchPanels }    
            openArchive = { this.navigateToFolderRoot }
            onePanel = { this.state.onePanel } />  
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
    onePanel,
    panel1SelectedTypeObject,
    panel2SelectedTypeObject,
    selection,
    isExtensionInstalled
  ) {
  return React.renderComponent(
    <HomeComponent 
      listboards={listboards} 
      onePanel={onePanel}
      panel1SelectedTypeObject = {panel1SelectedTypeObject}
      panel2SelectedTypeObject={panel2SelectedTypeObject}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}/>,
    document.getElementById('body-inner')
  );
};