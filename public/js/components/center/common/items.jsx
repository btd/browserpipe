/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),    
    _ = require('lodash'),
    util = require('../../../util'),
    page = require('page'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),    
    Item = require('./item'),  
    selection = require('../../../selection/selection');

var ItemsComponent = React.createClass({   
    mixins: [PanelActivatorMixin],
    handleSaveItemClick: function(e) {
        var self = this;
        e.preventDefault();
        var url = this.refs.itemInput.getDOMNode().value.trim();
        var errorElements = this.validateFields(url);
        if (errorElements.length === 0)
          this.props.saveItem(url, function() {
            self.hideItemInput();
          });
        else {
          errorElements.map(function(errorElement){
            errorElement.getDOMNode().className = errorElement.getDOMNode().className.replace('hide', '');
          })
        }
    },
    validateFields: function (url) {
        var errors = [];
        if (url === '')
            errors.push(this.refs.itemURLBlankError);
        else if (!util.isValidURL(url))
            errors.push(this.refs.itemURLInvalidError)
        return errors
    },
    getItemsClass: function() {
        return 'items' +        
        (this.props.scrollable? ' scrollable-parent scrollable-parent-y' : '');
    },
    showAndFocusAddItemInput: function() {          
        this.refs.addItem.getDOMNode().className = "opt-add-item hide";
        this.refs.itemEditor.getDOMNode().className = "input-append add-item";   
        this.refs.itemInput.getDOMNode().value = "";
        this.refs.itemInput.getDOMNode().focus(); 
    },
    hideItemInput: function() {
        this.refs.addItem.getDOMNode().className = "opt-add-item";
        this.refs.itemEditor.getDOMNode().className = "input-append add-item hide";
        this.refs.itemURLBlankError.getDOMNode().className = "help-inline hide item-url-blank";
        this.refs.itemURLInvalidError.getDOMNode().className = "help-inline hide item-url-invalid";
    },
    render: function() {
        var self = this;
        return <ul className={ this.getItemsClass() }>            
            <li>
                <a ref="addItem" draggable="false"  onClick={ this.handlePanelClick(this.showAndFocusAddItemInput) } className="opt-add-item">Add URL</a>          
                <div ref="itemEditor" className="input-append add-item hide">
                    <div className="control-group">    
                      <div className="controls">
                          <textarea ref="itemInput" className="new-item-url" cols="2"></textarea>
                          <div>
                            <span ref="itemURLBlankError" className="help-inline hide item-url-blank">Cannot be blank</span>
                            <span ref="itemURLInvalidError" className="help-inline hide item-url-invalid">Invalid URL</span>
                          </div>
                          <div>
                            <button onClick={ this.handlePanelClick(this.handleSaveItemClick) } className="btn add-item-save" type="button"><i className="icon-ok save-icon">&nbsp;Add URL</i></button>
                            <button onClick={ this.handlePanelClick(this.hideItemInput) } className="btn add-item-cancel" type="button"><i className="icon-remove cancel-icon"></i></button>
                        </div>
                    </div>
                  </div>
                </div>
            </li>
            {                    
              this.props.items.map(function(item) {
                  return <Item 
                    item= {item} 
                    activatePanel= { self.props.activatePanel }
                    navigateToItem={self.props.navigateToItem} 
                    removeItem={self.props.removeItem} />
              })
            }
        </ul>                      
    }
});

module.exports = ItemsComponent