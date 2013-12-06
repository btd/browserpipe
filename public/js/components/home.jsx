/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    TopBarComponent = require('./top/top.bar'),
    ListboardsPanelComponent = require('./center/listboards.panel'),
    ListboardPanel = require('./center/panel/listboard'),
    ContainerPanel = require('./center/panel/container'),
    ItemPanel = require('./center/panel/item'),
    FolderPanel = require('./center/panel/folder'),
    SearchPanel = require('./center/panel/search'),
    SelectionPanel = require('./center/panel/selection'),
    SelectionDraggable = require('./center/selection.draggable'),
    selection = require('../selection/selection'),
    navigation = require('../navigation/navigation');

var HomeComponent = React.createClass({  
  isPanel1Active: true, //Small trick have active panel before js tick
  getInitialState: function() {
      return {     
          isPanel1Active: this.isPanel1Active,
          panelPinnedNumber: 0,
          laterBoard: this.props.laterBoard,
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
        navigation.navigateToTwoPanels(
          this.state.panel1SelectedTypeObject.type,
          this.state.panel1SelectedTypeObject.getObjectId(),
          this.state.panel2SelectedTypeObject.type,
          this.state.panel2SelectedTypeObject.getObjectId()
        );
      else
        navigation.navigateToTwoPanels(
          this.state.panel1SelectedTypeObject.type,
          this.state.panel1SelectedTypeObject.getObjectId(),
          this.state.panel1SelectedTypeObject.type,
          this.state.panel1SelectedTypeObject.getObjectId()
        );
    }
    else { //Close one panel      
       if(this.isPanel1Active)
        navigation.navigateToOnePanel(
          this.state.panel1SelectedTypeObject.type,
          this.state.panel1SelectedTypeObject.getObjectId()
        );
      else
        navigation.navigateToOnePanel(
          this.state.panel2SelectedTypeObject.type,
          this.state.panel2SelectedTypeObject.getObjectId()
        );
    }
  },  
  navigateToListboard: function(listboardId) {
    navigation.updateOnePanel('listboard', listboardId, (this.isPanel1Active? 1 : 2));
  },
  navigateToContainer: function(containerId) {
    navigation.updateOnePanel('container', containerId, (this.isPanel1Active? 1 : 2))
  },
  navigateToItem: function(itemId) {
    navigation.updateOnePanel('item', itemId, (this.isPanel1Active? 1 : 2))
  },
  navigateToFolder: function(folderId) {
    navigation.updateOnePanel('folder', folderId, (this.isPanel1Active? 1 : 2))
  },
  navigateToFolderRoot: function() {
    var rootFolder = _state.getRootFolder();
    this.navigateToFolder(rootFolder._id);
  },
  performSearch: function(query) {
    navigation.updateOnePanel('search', query, (this.isPanel1Active? 1 : 2))
  },
  navigateToItemSelection: function() {
    navigation.updateOnePanel('selection', 'items', (this.isPanel1Active? 1 : 2))
  },
  activatePanel1: function(){
    if(!this.isPanel1Active && this.state.panelPinnedNumber === 0) {
      this.isPanel1Active = true;
      this.setState({ isPanel1Active : true });
    }
  },
  activatePanel2: function(){
    if(this.isPanel1Active && this.state.panelPinnedNumber === 0) {
      this.isPanel1Active = false;
      this.setState({ isPanel1Active : false });
    }
  },
  pinPanel1Toggle: function(){
    if(this.state.panelPinnedNumber === 1)
      this.setState({ panelPinnedNumber : 0 });
    else if(this.state.panelPinnedNumber === 0)
      this.setState({ panelPinnedNumber : 1 });
  },
  pinPanel2Toggle: function(){
    if(this.state.panelPinnedNumber === 2)
      this.setState({ panelPinnedNumber : 0 });
    else if(this.state.panelPinnedNumber === 0)
      this.setState({ panelPinnedNumber : 2 });
  },  
  getSelectedComponent: function(typeobject, fullWidth, panelNumber, active, activatePanel, pinPanelToggle){    
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
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle }
                  navigateToContainer = { this.navigateToContainer } />;
            break;
        }
        case 'container' : {                
            var container = typeobject.container;            
            if(container)
                return <ContainerPanel 
                  container= { container } 
                  selection = { selection }
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle }
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
                  activatePanel = { activatePanel } 
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle } />;
            break;
        }
        case 'folder' : {                
            var folder = typeobject.folder; 
            if(folder)
                return <FolderPanel 
                  folder= { folder } 
                  selection = { selection }
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  navigateToItem = { this.navigateToItem } 
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle }
                  navigateToFolder = { this.navigateToFolder } />;
            break;
        }
        case 'search' : {                
            var search = typeobject.search; 
            if(search)
                return <SearchPanel 
                  search= { search } 
                  selection = { selection }
                  fullWidth = { fullWidth } 
                  panelNumber = { panelNumber }
                  active = { active }
                  activatePanel = { activatePanel } 
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle }
                  navigateToItem = { this.navigateToItem } />;
            break;
        }
        case 'selection' : {           
            return <SelectionPanel
                selection = { selection }
                fullWidth = { fullWidth } 
                panelNumber = { panelNumber }
                active = { active }
                activatePanel = { activatePanel } 
                panelPinnedNumber = { this.state.panelPinnedNumber }
                pinPanelToggle = { pinPanelToggle }
                navigateToItem = { this.navigateToItem } />;
            break;
        }
    }    
  },
  render: function() {
    this.listboardsPanelComponent = <ListboardsPanelComponent         
      navigateToListboard={ this.navigateToListboard }
      navigateToContainer={ this.navigateToContainer }
      isPanel1Active={ this.isPanel1Active }
      panel1SelectedTypeObject= { this.state.panel1SelectedTypeObject } 
      panel2SelectedTypeObject= { this.state.panel2SelectedTypeObject } 
      isExtensionInstalled={ this.state.isExtensionInstalled }
      laterBoard = { this.state.laterBoard }
      listboards= { this.state.listboards } />
    
    if(!this.state.onePanel) {
      this.panel1 = this.getSelectedComponent(
        this.state.panel1SelectedTypeObject, 
        false, 
        1, 
        this.isPanel1Active, 
        this.activatePanel1,
        this.pinPanel1Toggle );
      this.panel2 = this.getSelectedComponent(
        this.state.panel2SelectedTypeObject,
        false,
        2,
        !this.isPanel1Active, 
        this.activatePanel2,
        this.pinPanel2Toggle );      
    }
    else if(this.state.panel1SelectedTypeObject) {
      this.panel1 = this.getSelectedComponent(
        this.state.panel1SelectedTypeObject, 
        true, 
        1, 
        true, 
        this.activatePanel1,
        this.pinPanel1Toggle );
      this.panel2 = null;
    }
    else if(this.state.panel2SelectedTypeObject) {
      this.panel1 = this.getSelectedComponent(
        this.state.panel2SelectedTypeObject, 
        true, 
        1, 
        true, 
        this.activatePanel1, 
        this.pinPanel1Toggle );
      this.panel2 = null; 
    }
    else {
      //We navigate to the archive
      var rootFolder = _state.getRootFolder();
      navigation.navigateToOnePanel('folder', rootFolder._id);      
    }

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent 
            switchPanels = { this.switchPanels }    
            openArchive = { this.navigateToFolderRoot }
            onePanel = { this.state.onePanel } 
            performSearch = { this.performSearch } />  
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
  },
  componentDidMount: function(){
    selection.setHandleViewClick(this.navigateToItemSelection);
  }
});


module.exports.render = function (
    laterBoard,
    listboards, 
    onePanel,
    panel1SelectedTypeObject,
    panel2SelectedTypeObject,
    selection,
    isExtensionInstalled
  ) {
  return React.renderComponent(
    <HomeComponent 
      laterBoard={laterBoard}
      listboards={listboards} 
      onePanel={onePanel}
      panel1SelectedTypeObject = {panel1SelectedTypeObject}
      panel2SelectedTypeObject={panel2SelectedTypeObject}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}/>,
    document.getElementById('body-inner')
  );
};