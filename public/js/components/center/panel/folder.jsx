/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('../common/item'),    
    Folder = require('../common/folder'), 
    LabelEditorComponent = require('../../util/label.editor'),    
    selection = require('../../../selection/selection');

var FolderPanel = React.createClass({ 
  saveFolderLabel: function(newLabel, success) {    
    _state.serverUpdateFolder({
      _id: this.props.folder._id,
      label: newLabel
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent', this.refs.folderPanel.getDOMNode()).perfectScrollbar({});
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
    this.props.navigateToFolder(parent._id);
  },
  navigateToChildFolder: function(folderId) {
    this.props.navigateToFolder(folderId);
  },
  renderUpFolder: function() {
    if(!this.props.folder.isRoot)
      return <li ref="folder"  onClick={this.navigateToParentFolder} className="folder">
          <span onClick={ this.folderClicked }>...</span>               
        </li>
    else 
      return null;
  },
  getPanelNumber: function (argument) {
    if(this.props.fullWidth)
      return null
    else
      return <div 
            className={"panel-number" + (this.props.active?' selected': '')}
            title={"Select panel " + this.props.panelNumber}
            onClick= { this.props.activatePanel }>
              { this.props.panelNumber }
            </div>
  },
  render: function() {
    var self = this;  
    return (               
        <div ref="folderPanel" 
            className={ this.getClassName() }
             onClick= { this.props.activatePanel }>
          <div className={ this.getSubBarClassName() }>
            <div className="navbar-inner">  
              { this.getPanelNumber() }                                 
              <ul className="nav pull-right">           
                <li>
                  <a draggable="false" title="Settings" className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
                  </a>
                </li>
              </ul>      
              <ul className="nav nav-left">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveFolderLabel} 
                    labelValue= {this.props.folder.label} 
                    defaultLabelValue= "Unnamed" />
                  <span className="sub-title">(folder)</span>
                </li>                                  
              </ul>            
            </div>
          </div>          
          <div className="panel-center">
            <div className="scrollable-parent scrollable-parent-y">            
              <ul className="folders">
                { this.renderUpFolder() } 
                {
                  this.props.folder.children.map(function(folder) {
                    return <Folder folder= {folder} folderClicked= {self.navigateToChildFolder}  />
                  })
                }
              </ul>
              <ul className="items">
                {                    
                  this.props.folder.items.map(function(item) {
                    return <Item item= {item} navigateToItem={self.props.navigateToItem} />
                  })
                }
              </ul>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = FolderPanel