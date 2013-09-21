/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    TopBarView = require('components/built/top/top.bar'),
    ListboardsPanelView = require('components/built/center/listboards.panel'),
    ListboardView = require('components/built/center/listboard');

var HomeView = React.createClass({displayName: 'HomeView',  
  getInitialState: function() {
      return {
          docHeight: this.props.docHeight,
          docWidth: this.props.docWidth,
          listboards: this.props.listboards,
          selectedListboard: this.props.selectedListboard
      };
  },
  handleListboardClick: function(e) {
      e.preventDefault();
      _state.setSelectedListboard(e.target.id.substring(3));
      var selectedListboard = _state.getSelectedListboard();
      this.setState({ selectedListboard: selectedListboard });      
  },
  render: function() {
    this.listboardsPanelView = ListboardsPanelView( {docWidth:this.state.docWidth, docHeight:this.state.docHeight, handleListboardClick: this.handleListboardClick,  selectedListboard:this.state.selectedListboard, listboards:this.state.listboards} );
    this.listboardView = ListboardView( {docWidth:this.state.docWidth, docHeight:this.state.docHeight, selectedListboard:this.state.selectedListboard} ) 

    return (
      React.DOM.div( {className:"wrapper"}, 
        React.DOM.div( {className:"main-header"}, 
          TopBarView( {docWidth:this.state.docWidth} )
        ),
        React.DOM.div( {className:"main-content"},                  
            this.listboardsPanelView,
            this.listboardView
        ),
        React.DOM.div( {className:"main-footer"}, 
          React.DOM.small(null, "@Listboard.it")
        )
      )
    );
  }
});


module.exports.render = function (docHeight, docWidth, listboards, selectedListboard) {
  return React.renderComponent(
    HomeView( {docHeight:docHeight, docWidth:docWidth, listboards:listboards, selectedListboard:selectedListboard}),
    document.body
  );
};
/*
module.exports.setDocumentSize = function (docHeight, docWidth,) {
  React.renderComponent(
    <HomeView docHeight={docHeight} docWidth={docWidth} listboards={listboards} selectedListboard={selectedListboard}/>,
    document.body
  );
};*/