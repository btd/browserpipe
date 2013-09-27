/**
 * @jsx React.DOM
 */

var _state = require('../../state')
    _ = require('lodash'),
    React = require('react'),
    Container = require('../center/container');

var LabelEditorComponent = React.createClass({  
  getInitialState: function() {
  },
  handleKeyUp: function(e) {
    this.setState({ labelInput: e.target.value });
  },
  showAndFocusInput: function() {      
    this.refs.label.getDOMNode().className = "le-label hide";
    this.refs.labelEditor.getDOMNode().className = "input-append le-editor";    
    this.refs.labelInput.getDOMNode().value = this.props.defaultLabelValue;
    this.refs.labelInput.getDOMNode().focus(); 
  },
  hideInput: function() {
    this.refs.label.getDOMNode().className = "le-label";
    this.refs.labelEditor.getDOMNode().className = "input-append le-editor hide";
  },
  saveLabel: function() {    
    this.props.onSaveLabel(
      this.refs.labelInput.getDOMNode().value,
      this.hideInput
    );
  },
  render: function() {
    var self = this;
    return ( 
      <div>       
        <div ref="label" class="le-label" onClick={this.showAndFocusInput}>{this.props.defaultLabelValue}</div>                
        <div ref="labelEditor" class="input-append le-editor hide">
          <input ref="labelInput" type="text" defaultValue={this.props.defaultLabelValue}
            onKeyUp={this.handleKeyUp} />
          <button onClick={this.saveLabel} class="btn edit-title-save" type="button"><i class="icon-ok"></i></button>
          <button onClick={this.hideInput} class="btn edit-title-cancel" type="button"><i class="icon-remove"></i></button>
        </div>
      </div>
    );
  }
});

module.exports = LabelEditorComponent