/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var ItemView = React.createClass({   
  getTitle: function() {
    if($.trim(this.props.item.get('title')) != "")
      return this.props.item.get('title');
    else
      return this.props.item.get('url');
  },    
  render: function() {
    return (          
      <li class="item"> 
        <i class="icon-remove remove-item" title="Close"></i>
        <img class="favicon" src={ this.props.item.get('favicon') } alt="Favicon" />
        <a class="title" target="_blank" href={ this.props.item.get('url') }>
          {  this.getTitle()  } 
        </a>
        <div class="description">{ this.props.item.get('note') }</div>  		
      </li>
    );
  }
});

module.exports = ItemView
