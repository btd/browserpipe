/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    React = require('react'),
    PanelActivatorMixin = require('./panel.activator.mixin');

var LabelEditorComponent = React.createClass({ 
  mixins: [PanelActivatorMixin],

  showAndFocusInput: function(e) {  
    if(e.ctrlKey)
      return; //User may be selecting
    e.preventDefault();
    e.stopPropagation();
    this.refs.label.getDOMNode().className = "hide";
    this.refs.labelEditor.getDOMNode().className = "input-append le-editor" 
    this.refs.labelInput.getDOMNode().value = (this.props.labelValue? this.props.labelValue : '') ;
    this.refs.labelInput.getDOMNode().focus(); 
  },
  hideInput: function() {
    this.refs.label.getDOMNode().className = "le-label" + (this.props.labelValue? '' : ' default');
    this.refs.labelEditor.getDOMNode().className = "hide";
  },
  saveLabel: function() {    
    //TODO: add label required validation to be configurable, validate method
    this.props.onSaveLabel(
      this.refs.labelInput.getDOMNode().value,
      this.hideInput
    );
  },

  ifEnterSave: function(e) {
    if(e.keyCode === 13) this.saveLabel();
  },

  render: function() {
    var self = this;
    return ( 
      <div className="label-editor">               
        <div ref="label" 
          className={"le-label" + (this.props.labelValue? '' : ' default')} 
          onClick={this.handlePanelClick(this.showAndFocusInput)}
          title={this.props.labelValue? this.props.labelValue : this.props.defaultLabelValue} >
            {this.props.labelValue? this.props.labelValue : this.props.defaultLabelValue}
        </div>                
        <div ref="labelEditor" className="input-append le-editor hide">
          <input ref="labelInput" type="text" defaultValue={this.props.labelValue} onKeyPress={this.ifEnterSave} />
          <button onClick={this.handlePanelClick(this.saveLabel)} className="btn edit-title-save" type="button"><i className="icon-check"></i></button>
          <button onClick={this.handlePanelClick(this.hideInput)} className="btn edit-title-cancel" type="button"><i className="icon-times"></i></button>
        </div>
      </div>
    );
  }
});

module.exports = LabelEditorComponent