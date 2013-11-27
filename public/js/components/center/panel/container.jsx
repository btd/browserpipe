/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('../common/item'),    
    LabelEditorComponent = require('../../util/label.editor'),    
    selection = require('../../../selection/selection');

var ContainerPanel = React.createClass({ 
  saveContainerLabel: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.container._id,
      listboardId: this.props.container.listboardId,
      title: newTitle
    }, success );
  },
  componentDidMount: function(){    
    $('.scrollable-parent', this.refs.containerPanel.getDOMNode()).perfectScrollbar({});
  },  
  getClassName: function() {
    return 'container-panel panel' + 
      (this.props.fullWidth?' full-width': ' half-width');
  },
  getSubBarClassName: function() {
    return 'navbar sub-bar' + 
      (this.props.active?' border': '');
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
        <div ref="containerPanel" 
            className={ this.getClassName() } 
            onClick= { this.props.activatePanel } >
          <div className={ this.getSubBarClassName() } >
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
                    onSaveLabel= {this.saveContainerLabel} 
                    labelValue= {this.props.container.title} 
                    defaultLabelValue= "Unnamed" />  
                  <span className="sub-title">{this.props.container.type === 0 ? '(window)' : '(onhold window)'}</span>
                </li>                                  
              </ul>                            
            </div>
          </div>          
          <div className="panel-center">
            <ul className="items scrollable-parent scrollable-parent-y">
            {                    
              this.props.container.items.map(function(item) {
                  return <Item item= {item} navigateToItem={self.props.navigateToItem} />
              })
            }
            </ul>
          </div>
        </div>
    );


     /**/
  }
});

module.exports = ContainerPanel