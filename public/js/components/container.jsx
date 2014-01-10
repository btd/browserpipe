/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    $ = require('jquery'),
    page = require('page'),
    React = require('react'),
    websocket = require('../websocket/websocket');

var ContainerComponent = React.createClass({ 
  closeOptionClicked: function(e) {
    e.stopPropagation();
    _state.serverDeleteItem(this.props.container, function(){
      page('/');
    });
  },
  containerClicked: function() {
    page('/item/' + this.props.container._id); 
  },
  render: function() {
    return (
      <div onClick={ this.containerClicked } className={"container" + (this.props.active?" active":"")} >
	<i onClick={ this.closeOptionClicked } className="close-option icon-th-large"></i>
      </div>
    );
  },
});  

module.exports = ContainerComponent 
