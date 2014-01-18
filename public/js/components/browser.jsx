/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    websocket = require('../websocket/websocket');

var BrowserComponent = React.createClass({    
  getInitialState: function() {
      return {     
          selected: this.props.selected,
      };
  },
  homeOptionClicked: function() { 
    $('#browser-section .browser-content').contents().find('body').empty();
    page('/item/' + this.state.selected.parent);
  },
  navigateToURL: function() {
     var url = this.refs.urlInput.getDOMNode().value.trim();
     websocket.send('browser.navigate', { itemId: this.state.selected._id, url: url });
  },
  render: function() {
    var self = this;
    return (
      <div className="browser">
        <div className="browser-commands" >
	  <input type="text" className="url-input" ref="urlInput" value={this.state.selected.url} />
	  <input type="button" className="url-btn" value="Go"  onClick={this.navigateToURL} />
	  <div className="home-option" onClick={ this.homeOptionClicked } >
	    <i className="icon-th-large"></i>
	  </div>
        </div>
        <iframe src='about:blank' className="browser-content">
	</iframe>
      </div>
    );
  },
  componentDidUpdate: function() {
   websocket.send('browser.open', { itemId: this.state.selected._id });
  },
  componentDidMount: function() {
   websocket.send('browser.open', { itemId: this.state.selected._id });
  }
});


module.exports.render = function (
    selected
  ) {
  return React.renderComponent(
    <BrowserComponent 
      selected={selected} />,
    document.getElementById('browser-section')
  );
};
