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
          panel1SelectedTypeId: this.props.panel1SelectedTypeId,
          panel2SelectedTypeId: this.props.panel2SelectedTypeId,
          selection: this.props.selection,
          isExtensionInstalled: this.props.isExtensionInstalled
      };
  },  
  navigateToTypeId: function(type, id){
    //Check if there is a second panel
    if(this.state.panel2SelectedTypeId){
      if(this.state.isPanel1Active)
        page('/panel1/' + type + '/' + id + '/panel2/' + this.state.panel2SelectedTypeId.type + '/' + this.state.panel2SelectedTypeId._id);
      else
        page('/panel1/' + this.state.panel1SelectedTypeId.type + '/' + this.state.panel1SelectedTypeId._id + '/panel2/' + type + '/' + id);
    }
    else
      page('/panel1/' + type + '/' + id);
  },
  navigateToListboard: function(listboardId) {
    this.navigateToTypeId('listboard', listboardId);
  },
  navigateToContainer: function(containerId) {
    this.navigateToTypeId('container', containerId);
  },
  navigateToItem: function(itemId) {
    this.navigateToTypeId('item', itemId);
  },
  navigateToFolder: function(folderId) {
    this.navigateToTypeId('folder', folderId);
  },
  activatePanel1: function(){
    if(!this.state.isPanel1Active)
      this.setState({ isPanel1Active : true });
  },
  activatePanel2: function(){
    if(this.state.isPanel1Active)
      this.setState({ isPanel1Active : false });
  },
  getSelectedComponent: function(typeid, fullWidth, active, activatePanel){    
    switch(typeid.type){
        case 'listboard' : {                
            var listboard = _state.getListboardById(typeid._id);            
            if(listboard)
                return <ListboardPanel 
                  listboard= { listboard } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
                  navigateToContainer = { this.navigateToContainer } />;
            break;
        }
        case 'container' : {                
            var container = _state.getContainerById(typeid._id);
            if(container)
                return <ContainerPanel 
                  container= { container } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
                  navigateToItem = { this.navigateToItem } />;
            break;
        }
        case 'item' : {                
            var item = _state.getItemById(typeid._id);
            if(item)
                return <ItemPanel 
                  item= { item } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } />;
            break;
        }
        case 'folder' : {                
            var folder = _state.getFolderById(typeid._id);
            if(folder)
                return <FolderPanel 
                  folder= { folder } 
                  fullWidth = { fullWidth } 
                  active = { active }
                  onClickEvent = { activatePanel } 
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
      navigateToFolder={ this.navigateToFolder } 
      isPanel1Active={ this.state.isPanel1Active }
      panel1SelectedTypeId= { this.state.panel1SelectedTypeId } 
      panel2SelectedTypeId= { this.state.panel2SelectedTypeId } 
      isExtensionInstalled={ this.state.isExtensionInstalled }
      listboards= { this.state.listboards } />
    
    if(this.state.panel1SelectedTypeId && this.state.panel2SelectedTypeId) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedTypeId, false, this.state.isPanel1Active, this.activatePanel1);
      this.panel2 = this.getSelectedComponent(this.state.panel2SelectedTypeId, false, !this.state.isPanel1Active, this.activatePanel2);
    }
    else if(this.state.panel1SelectedTypeId) {
      this.panel1 = this.getSelectedComponent(this.state.panel1SelectedTypeId, true, true, this.activatePanel1);
      this.panel2 = null;
    }
    else if(this.state.panel2SelectedTypeId) {
      this.panel1 = this.getSelectedComponent(this.state.panel2SelectedTypeId, true, true, this.activatePanel1);
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
    panel1SelectedTypeId,
    panel2SelectedTypeId,
    selection,
    isExtensionInstalled
  ) {
  return React.renderComponent(
    <HomeComponent 
      listboards={listboards} 
      panel1SelectedTypeId = {panel1SelectedTypeId}
      panel2SelectedTypeId={panel2SelectedTypeId}
      selection={selection}
      isExtensionInstalled={isExtensionInstalled}/>,
    document.getElementById('body-inner')
  );
};