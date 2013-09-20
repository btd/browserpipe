/**
 * @jsx React.DOM
 */

var React = require('React');
var TopBarView = require('components/built/top/top.bar');
var ListboardsPanelView = require('components/built/center/listboards.panel');
var ListboardView = require('components/built/center/listboard');

var HomeView = React.createClass({displayName: 'HomeView',  
  render: function() {
    return (
      React.DOM.div( {className:"wrapper"}, 
        React.DOM.div( {className:"header"}, 
          TopBarView( {docWidth:this.props.docWidth} )
        ),
        React.DOM.div( {className:"content"},                  
            ListboardsPanelView( {docWidth:this.props.docWidth, docHeight:this.props.docHeight} ),      
            ListboardView( {docWidth:this.props.docWidth, docHeight:this.props.docHeight} ) 
        ),
        React.DOM.div( {className:"footer"}, 
          React.DOM.small(null, "@Listboard.it")
        )
      )
    );
  }
});


module.exports.render = function (docHeight, docWidth) {
  React.renderComponent(
    HomeView( {docHeight:docHeight, docWidth:docWidth} ),
    document.body
  );
};

module.exports.setDocumentSize = function (docHeight, docWidth) {
  React.renderComponent(
    HomeView( {docHeight:docHeight, docWidth:docWidth} ),
    document.body
  );
};