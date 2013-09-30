/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    page = require('page'),
    _ = require('lodash'),
    React = require('react');

var ItemView = React.createClass({   
  getTitle: function() {
    if($.trim(this.props.item.title) != "")
      return this.props.item.title;
    else
      return this.props.item.url;
  }, 
  navigateToItem: function(e) {
    e.preventDefault();
    page('/item/' + this.props.item._id);
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
        <img onClick={ this.navigateToItem } class="screenshot" src="/img/no_screenshot.png" alt="ScreenShot" />  
      </li>
    );
  }
});

module.exports = ItemView
