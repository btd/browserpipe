/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Container = require('components/built/center/container');

var LabelEditorComponent = React.createClass({displayName: 'LabelEditorComponent',  
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
      React.DOM.div(null,        
        React.DOM.div( {ref:"label", className:"le-label", onClick:this.showAndFocusInput}, this.props.defaultLabelValue),                
        React.DOM.div( {ref:"labelEditor", className:"input-append le-editor hide"}, 
          React.DOM.input( {ref:"labelInput",type:"text", defaultValue:this.props.defaultLabelValue,
            onKeyUp:this.handleKeyUp} ),
          React.DOM.button( {onClick:this.saveLabel, className:"btn edit-title-save", type:"button"}, React.DOM.i( {className:"icon-ok"})),
          React.DOM.button( {onClick:this.hideInput, className:"btn edit-title-cancel", type:"button"}, React.DOM.i( {className:"icon-remove"}))
        )
      )
    );
  }
});

module.exports = LabelEditorComponent