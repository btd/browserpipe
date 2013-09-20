/**
 * @jsx React.DOM
 */

var React = require('React');
var TopBarView = require('components/built/top/top.bar');
var ListboardsPanelView = require('components/built/center/listboards.panel');
var ListboardView = require('components/built/center/listboard');

var HomeView = React.createClass({  
  render: function() {
    return (
      <div class="wrapper">
        <div class="header">
          <TopBarView docWidth={this.props.docWidth} />
        </div>
        <div class="content">                 
            <ListboardsPanelView docWidth={this.props.docWidth} docHeight={this.props.docHeight} />      
            <ListboardView docWidth={this.props.docWidth} docHeight={this.props.docHeight} /> 
        </div>
        <div class="footer">
          <small>@Listboard.it</small>
        </div>
      </div>
    );
  }
});


module.exports.render = function (docHeight, docWidth) {
  React.renderComponent(
    <HomeView docHeight={docHeight} docWidth={docWidth} />,
    document.body
  );
};

module.exports.setDocumentSize = function (docHeight, docWidth) {
  React.renderComponent(
    <HomeView docHeight={docHeight} docWidth={docWidth} />,
    document.body
  );
};