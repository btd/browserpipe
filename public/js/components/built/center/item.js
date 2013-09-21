/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var ItemView = React.createClass({displayName: 'ItemView',   
  getTitle: function() {
    if($.trim(this.props.item.get('title')) != "")
      return this.props.item.get('title');
    else
      return this.props.item.get('url');
  },    
  render: function() {
    return (          
      React.DOM.li( {className:"item"},  
        React.DOM.i( {className:"icon-remove remove-item", title:"Close"}),
        React.DOM.img( {className:"favicon", src: this.props.item.get('favicon'),  alt:"Favicon"} ),
        React.DOM.a( {className:"title", target:"_blank", href: this.props.item.get('url') }, 
            this.getTitle()   
        ),
        React.DOM.div( {className:"description"},  this.props.item.get('note') )  		
      )
    );
  }
});

module.exports = ItemView
