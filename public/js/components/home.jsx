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
  getInitialState: function() {
      return {     
          isPanel1Active: _state.isPanel1Active,
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
       if(_state.isPanel1Active)
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
  activatePanel1: function(){
    if(!_state.isPanel1Active && this.state.panelPinnedNumber === 0) {
      _state.isPanel1Active = true;
      this.setState({ isPanel1Active : true });
      selection.updateSelectionMessage();
    }
  },
  activatePanel2: function(){
    if(_state.isPanel1Active && this.state.panelPinnedNumber === 0) {      
      _state.isPanel1Active = false;
      this.setState({ isPanel1Active : false });
      selection.updateSelectionMessage();
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
                  pinPanelToggle = { pinPanelToggle } />;
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
                  pinPanelToggle = { pinPanelToggle } />;
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
                  panelPinnedNumber = { this.state.panelPinnedNumber }
                  pinPanelToggle = { pinPanelToggle } />;
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
                  pinPanelToggle = { pinPanelToggle } />;
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
                pinPanelToggle = { pinPanelToggle } />;
            break;
        }
    }    
  },
  render: function() {
    this.listboardsPanelComponent = <ListboardsPanelComponent    
      isPanel1Active={ _state.isPanel1Active }
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
        _state.isPanel1Active, 
        this.activatePanel1,
        this.pinPanel1Toggle );
      this.panel2 = this.getSelectedComponent(
        this.state.panel2SelectedTypeObject,
        false,
        2,
        !_state.isPanel1Active, 
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
    else      
      navigation.navigateToFolderRoot();

    return (
      <div onClick={this.handleBodyClick} className="wrapper">
        <div className="main-header">
          <TopBarComponent 
            switchPanels = { this.switchPanels }                
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