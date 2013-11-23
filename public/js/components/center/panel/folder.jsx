/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('../common/item'),    
    LabelEditorComponent = require('../util/label.editor'),    
    selection = require('../../selection/selection');

var FolderPanel = React.createClass({ 
  saveFolderLabel: function(newLabel, success) {    
    _state.serverUpdateFolder({
      _id: this.props.folder._id,
      label: newLabel
    }, success );
  },
  componentDidMount: function(){
    $('.scrollable-parent').perfectScrollbar({});
  },  
  render: function() {
    var self = this;  
    return (               
        <div className="folder-panel panel">
          <div className="navbar sub-bar">
            <div className="navbar-inner">
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveFolderLabel} 
                    labelValue= {this.props.folder.label} 
                    defaultLabelValue= "Unnamed" />
                  <span className="last-sync-time">(last sync 2 min ago)</span>
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-folder btn" onClick={this.addEmptyFolder} href="#" title="Add empty folder" data-toggle="tooltip">
                    <i className="icon-plus"></i>
                  </a>
                </li>                
                <li className="divider"></li>
                <li>
                  <a draggable="false"  className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
                  </a>
                </li>
              </ul>                
            </div>
          </div>          
          <div className="folder-center">
            <div className="scrollable-parent">            
              <ul className="folders">
                { this.renderUpFolder() } 
                {
                  this.props.folder.children.map(function(folder) {
                    return <Folder folder= {folder} />
                  })
                }
              </ul>
              <ul className="items scrollable-parent">
                {                    
                  this.props.folder.items.map(function(item) {
                    return <Item item= {item}/>
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