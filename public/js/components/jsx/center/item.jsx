/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var ItemView = React.createClass({   
  getTitle: function() {
    if($.trim(this.props.item.title) != "")
      return this.props.item.title;
    else
      return this.props.item.url;
  },    
  render: function() {
    return (          
      <li class="item"> 
        <i class="icon-remove remove-item" title="Close"></i>
        <img class="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a class="title" target="_blank" href={ this.props.item.url }>
          {  this.getTitle()  } 
        </a>
        <div class="description">{ this.props.item.note }</div>  		
      </li>
    );
  }
});

module.exports = ItemView
