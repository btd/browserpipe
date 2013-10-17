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
  getScreenshot: function() {
    return this.props.item.screenshot || "/img/no_screenshot.png";
  },
  navigateToItem: function(e) {
    e.preventDefault();
    page('/item/' + this.props.item._id);
  },
  stopPropagation: function(e) {
    e.stopPropagation();      
  },
  render: function() {
    return (          
      <li onClick={ this.navigateToItem } class="item"> 
        <i class="icon-remove remove-item" title="Close"></i>
        <img class="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a onClick={ this.stopPropagation } class="title" target="_blank" href={ decodeURIComponent(this.props.item.url) }>
          {  this.getTitle()  } 
        </a>
        <div class="description">{ this.props.item.note }</div>  		
        <div class="screenshot-container">
          <img class="screenshot" src={ this.getScreenshot() } alt="ScreenShot" />
        </div>  
      </li>
    );
  }
});

module.exports = ItemView
