/**
 * @jsx React.DOM
 */

var React = require('React');

var ListboardsPanelView = React.createClass({displayName: 'ListboardsPanelView',  
  getListboardsPanelHeight: function() {
    return this.props.docHeight - 47 - 21; //document - top bar - footer
  },
  getListboardsPanelWidth: function() {
    return this.props.docWidth; 
  },  
  getListboardsWidth: function() {
    return 5000;
  },
  render: function() {
    return (        
        React.DOM.div( {className:"listboards-panel", style:this.props.docWidth > 575 ? {height: this.getListboardsPanelHeight()} : {width: this.getListboardsPanelWidth()}}, 
            React.DOM.ul( {className:"listboards", style:this.props.docWidth > 575 ? {} : {width: this.getListboardsWidth()}}, 
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1")),
                React.DOM.li(null, React.DOM.a( {href:"#"}, "Container1"))
            )
        )
    );
  }
});

module.exports = ListboardsPanelView