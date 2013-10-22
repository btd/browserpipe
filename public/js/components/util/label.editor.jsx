/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    React = require('react'),
    Container = require('../center/container');

var LabelEditorComponent = React.createClass({ 
  showAndFocusInput: function() {      
    this.refs.label.getDOMNode().className = "hide";
    this.refs.labelEditor.getDOMNode().className = "input-append le-editor" 
    this.refs.labelInput.getDOMNode().value = this.props.labelValue;
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
  render: function() {
    var self = this;
    return ( 
      <div>               
        <div ref="label" 
          className={"le-label" + (this.props.labelValue? '' : ' default')} 
          onClick={this.showAndFocusInput}
          title={this.props.labelValue? this.props.labelValue : this.props.defaultLabelValue} >
            {this.props.labelValue? this.props.labelValue : this.props.defaultLabelValue}
        </div>                
        <div ref="labelEditor" className="input-append le-editor hide">
          <input ref="labelInput" type="text" defaultValue={this.props.labelValue} />
          <button onClick={this.saveLabel} className="btn edit-title-save" type="button"><i className="icon-ok"></i></button>
          <button onClick={this.hideInput} className="btn edit-title-cancel" type="button"><i className="icon-remove"></i></button>
        </div>
      </div>
    );
  }
});

module.exports = LabelEditorComponent