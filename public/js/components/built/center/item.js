/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var ItemView = React.createClass({displayName: 'ItemView',   
  getTitle: function() {
    if($.trim(this.props.item.title) != "")
      return this.props.item.title;
    else
      return this.props.item.url;
  },    
  render: function() {
    return (          
      React.DOM.li( {className:"item"},  
        React.DOM.i( {className:"icon-remove remove-item", title:"Close"}),
        React.DOM.img( {className:"favicon", src: this.props.item.favicon,  alt:"Favicon"} ),
        React.DOM.a( {className:"title", target:"_blank", href: this.props.item.url }, 
            this.getTitle()   
        ),
        React.DOM.div( {className:"description"},  this.props.item.note )  		
      )
    );
  }
});

module.exports = ItemView
