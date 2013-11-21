/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('./item'),    
    LabelEditorComponent = require('../util/label.editor'),
    /*containerDraggable = require('../../dragging/container'),*/
    selection = require('../../selection/selection');

var ListboardComponent = React.createClass({ 
  /*getListboardHeight: function() {
    return this.props.height - 136; //(36 = listboard subbar height)
  },*/
  /*getListboardWidth: function() {    
    return this.props.width; 
  },*/
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
  goToSettings: function(e) {
    page('/listboard/' + this.props.selectedListboard._id + '/settings');
    e.preventDefault();
  },
  /*getListboardStyle: function() {
      var visible = this.props.visible? "block" : "none";
      return { width: this.getListboardWidth(), display: visible };
  },*/
  getNavInnerClass: function(listboard) {
      return 'navbar-inner ' +      
      (this.props.selectedListboard.type === 0 ? 'browser' : 'custom')
  },
  componentDidMount: function(){
    $('.listboard-center .items').perfectScrollbar({
        });
  },  
  render: function() {
    var self = this;  
    //var containersHeight = this.getListboardHeight();        
    //var forceSelected = selection.isListboardSelected(this.props.selectedListboard._id);
    return (               
        <div className="listboard" /*style={this.getListboardStyle()}*/ >
          <div className="navbar sub-bar">
            <div className={ this.getNavInnerClass() }>
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveListboardLabel} 
                    labelValue= {this.props.selectedListboard.label} 
                    defaultLabelValue= "Unnamed" />
                  <span className="last-sync-time">(last sync 2 min ago)</span>
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
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
          <div className="listboard-center" /*style= {{ height: this.getListboardHeight() }}*/ >
            <ul className="items scrollable-parent"
              /*onDragOver={itemDraggable.parentDragOver}
                      onEnter={itemDraggable.parentDragEnter}
                      onDragLeave={itemDraggable.parentDragLeave}
                      onDrop={itemDraggable.parentDrop}*/
            >
            {                    
                  _.flatten(
                    this.props.selectedListboard.containers.map(function(container) { 
                      return container.items.map(function(item) {
                          return <Item 
                        item= {item} 
                        /*isTab= {isTab}
                        itemDraggable={itemDraggable} 
                        forceSelected={forceSelected}*/ />
                      })
                    })
                  )
            }
            </ul>
            /*<ul className="containers" 
                onDragOver={containerDraggable.parentDragOver}
                onEnter={containerDraggable.parentDragEnter}
                onDragLeave={containerDraggable.parentDragLeave}
                onDrop={containerDraggable.parentDrop}
            >
            {   
                this.props.selectedListboard.containers.map(function(container) {                  
                    return <Container 
                      container= { container } 
                      selectedListboard= { self.props.selectedListboard } 
                      containersHeight= { containersHeight }
                      containerDraggable= { containerDraggable }
                      forceSelected={forceSelected} />
                })
            }
            </ul>*/
          </div>
        </div>
    );
  }
});

module.exports = ListboardComponent