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
    Folder = require('../common/folder'), 
    ItemsComponent = require('../common/items'),
    navigation = require('../../../navigation/navigation');

var FolderPanel = React.createClass({ 
  mixins: [PanelMixin, PanelActivatorMixin],
  saveFolderLabel: function(newLabel, success) {    
    _state.serverUpdateFolder({
      _id: this.props.folder._id,
      label: newLabel
    }, success );
  },  
  showAndFocusAddFolderInput: function() {          
    this.refs.folderEditor.getDOMNode().className = "input-append add-folder";   
    this.refs.folderInput.getDOMNode().value = "";
    this.refs.folderInput.getDOMNode().focus(); 
  },
  hideFolderInput: function() {
    this.refs.folderEditor.getDOMNode().className = "input-append add-folder hide";
  },
  saveFolderLabel: function(newLabel, success) {    
     _state.serverUpdateFolder(
       {
         _id: this.props.folder._id,
         label: newLabel
       },
       success 
     );
  },
  saveFolder: function() {    
    var self = this;
    var label = this.refs.folderInput.getDOMNode().value.trim()
    var path = this.props.folder.filter;

    if(label != '')
      _state.serverSaveFolder({
        label: label,
        path: path
      }, function(){
        self.hideFolderInput();
      });
  },
  saveItem: function(url, success) {    
    _state.serverSaveItemToFolder(
      this.props.folder._id, 
      {       
        type: 0,
        url: url
      },
      function(){
        if(success)
          success();
      }
    );
  },
  removeItem: function(item, success) {    
    _state.serverRemoveItemFromFolder(
      this.props.folder._id, 
      item,
      function(){
        if(success)
          success();
      }
    );
  },
  handleDeleteClick: function(e) {          
    e.preventDefault();
    _state.serverRemoveFolder(this.props.folder);
  }, 
  getClassName: function() {
    return 'folder-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
  },
  navigateToParentFolder: function() {    
    var parent = _state.getFolderByFilter(this.props.folder.path);
    navigation.navigateToFolder(parent._id);
  },
  navigateToChildFolder: function(folderId) {
    navigation.navigateToFolder(folderId);
  },
  getPanelNumber: function () {
    if(this.props.fullWidth)
      return null
    else
      return <div 
            className={"panel-number" + (this.props.active?' selected': '')}
            title={"Select panel " + this.props.panelNumber} >            
              { this.props.panelNumber }
            </div>
  },
  getPanelLabel: function() {
    if(this.props.folder.isRoot)
      return <li className="label-text" title="Archive">Archive</li>
    else
      return  <li>
                <LabelEditorComponent 
                  activatePanel= { this.props.activatePanel }
                  onSaveLabel= {this.saveFolderLabel} 
                  labelValue= {this.props.folder.label} 
                  defaultLabelValue= "Unnamed" />
                <span className="sub-title">archive</span>
              </li>
  },
  getSubBarSettingOptions: function() {
    if(this.props.folder.isRoot)
      return null
    else
      return  <li className="dropdown">
                <a href="#" title="Settings" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="icon-cog"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><a tabindex="-1" href="#" onClick={ this.handlePanelClick(this.handleDeleteClick) }>Delete</a></li>
                </ul>
              </li>
  },  
  renderUpFolder: function() {
    if(!this.props.folder.isRoot)
      return <li ref="folder"  onClick={this.handlePanelClick(this.navigateToParentFolder)} className="folder">
          <span onClick={ this.handlePanelClick(this.folderClicked) }>...</span>               
        </li>
    else 
      return null;
  },
  renderChildrenFolders: function() {
    var self = this;  
    return _.map(_state.getFoldersByIds(this.props.folder.children), function(folder) {
      return <Folder 
                folder= {folder} 
                activatePanel= { self.props.activatePanel }
                folderClicked= {self.navigateToChildFolder}  />
    })
  },
  render: function() {
    return (               
        <div ref="folderPanel" 
            className={ this.getClassName() }
             onClick= { this.handlePanelClick(this.props.activatePanel) }>
          <div className={ this.getSubBarClassName() }>
            <div className="navbar-inner">  
              { this.getPanelNumber() }                
              <ul className="nav nav-right">  
                { this.getPanelPin() }
                <li className="">
                  <a href="#" title="Add folder">
                    <i 
                      className="icon-folder-close"
                      onClick= { this.handlePanelClick(this.showAndFocusAddFolderInput) }
                    ></i>
                  </a>
                </li>                     
                { this.getSubBarSettingOptions() }                            
              </ul>      
              <ul className="nav nav-left">                                  
                { this.getPanelLabel() }
              </ul>            
            </div>
          </div>          
          <div className="panel-center">
            <div className="scrollable-parent scrollable-parent-y">            
              <ul className="folders">              
                { this.renderUpFolder() } 
                { this.renderChildrenFolders() }
                <li ref="folderEditor" className="input-append add-folder hide">
                  <div className="control-group">    
                      <div className="controls">
                      <input ref="folderInput" className="new-folder-label" type="text" onKeyPress={this.onEnterSaveFolder}/>
                      <div>
                          <button onClick={ this.handlePanelClick(this.saveFolder) } className="btn add-folder-save" type="button"><i className="icon-ok small-font">&nbsp;Add folder</i></button>
                          <button onClick={ this.handlePanelClick(this.hideFolderInput) } className="btn add-folder-cancel" type="button"><i className="icon-remove small-font"></i></button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <ItemsComponent 
                items= { _state.getItemsByIds(this.props.folder.items) }
                selection = { this.props.selection }
                activatePanel= { this.props.activatePanel }
                scrollable = { false } 
                saveItem={ this.saveItem }
                removeItem={ this.removeItem } />
            </div>
          </div>
        </div>
    );
  },  
  componentDidMount: function(){
    $('.scrollable-parent', this.refs.folderPanel.getDOMNode()).perfectScrollbar({});
  }, 
  componentDidUpdate: function(){
    $('.scrollable-parent', this.refs.folderPanel.getDOMNode()).perfectScrollbar('update');
  }
});

module.exports = FolderPanel