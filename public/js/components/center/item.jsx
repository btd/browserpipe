/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    page = require('page'),
    _ = require('lodash'),
    React = require('react');

var ItemComponent = React.createClass({   
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
      <li onClick={ this.navigateToItem } className="item"> 
        <i className="icon-remove remove-item" title="Close"></i>
        <img className="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a onClick={ this.stopPropagation } className="title" target="_blank" href={ decodeURIComponent(this.props.item.url) }>
          {  this.getTitle()  } 
        </a>
        <div className="description">{ this.props.item.note }</div>  		
        <div className="screenshot-container">
          <img className="screenshot" src={ this.getScreenshot() } alt="ScreenShot" />
        </div>  
      </li>
    );
  }
});

module.exports = ItemComponent
