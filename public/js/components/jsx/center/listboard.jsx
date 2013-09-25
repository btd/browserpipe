/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Container = require('components/built/center/container');
    LabelEditorComponent = require('components/built/util/label.editor');

var ListboardView = React.createClass({ 
  getListboardWidth: function() {    
    return this.props.docWidth; 
  },
  getContainersWidth: function() {
    return this.props.selectedListboard.containers.length * 264; //(260px; = container width) + (4 = container margin)
  },
  //TODO: manage scrollbars correctly
  getContainersHeight: function() {
    var height = this.props.docHeight - 47 - 21 - 36 - 40; //(47 = top bar height)(21 = footer height)(36 = listboard subbar height) (40 = scrollbars height )
    if(this.props.docWidth > 575) //(575 = responsive design limit)
      height = height - 48; //(72 = listboard panel height)
    else
      height = height - 36 //(36 = listboard panel height)
    return height;
  },
  getContainersStyle: function() {
    return {
        width: this.getContainersWidth(),
        height: this.getContainersHeight()
    };
  },
  saveListboardLabel: function(newLabel, success) {    
    _state.serverUpdateListboard({
      _id: this.props.selectedListboard._id,
      label: newLabel
    }, success );
  },
  addEmptyContainer: function() {      
      _state.serverSaveContainer(this.props.selectedListboard._id, {
          type: 1
      })
  },
  addFolderContainer: function() {
      var rootFolderId = _state.getFolderByFilter('Folders')._id;
      _state.serverSaveContainer(this.props.selectedListboard._id, {
          type: 2,
          folder: rootFolderId
      })
  },
  render: function() {
    var self = this;    
    return (        
        <div class="listboard" style={{width: this.getListboardWidth()}} >
          <div class="navbar sub-bar">
            <div class="navbar-inner">
              <ul class="nav">                
                <li>
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveListboardLabel} 
                    defaultLabelValue= {this.props.selectedListboard.label} />
                  </li>
                <li class="divider"></li>
                <li>
                  <a class="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
                    <i class="icon-plus"></i>
                  </a>
                </li>
                <li>
                  <a class="add-container btn" onClick={this.addFolderContainer} href="#" title="Add folder container" data-toggle="tooltip">
                    Folders
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <ul class="containers" style={this.getContainersStyle()} >
          {                    
              this.props.selectedListboard.containers.map(function(container) {
                  return <Container 
                    container= {container} 
                    selectedListboard= {self.props.selectedListboard} 
                    containersHeight={ self.getContainersHeight() } />
              })
          }
          </ul>
        </div>
    );
  }
});

module.exports = ListboardView