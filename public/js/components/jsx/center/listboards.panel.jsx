/**
 * @jsx React.DOM
 */

var React = require('React');

var ListboardsPanelView = React.createClass({  
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
        <div class="listboards-panel" style={this.props.docWidth > 575 ? {height: this.getListboardsPanelHeight()} : {width: this.getListboardsPanelWidth()}}>
            <ul class="listboards" style={this.props.docWidth > 575 ? {} : {width: this.getListboardsWidth()}}>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
                <li><a href="#">Container1</a></li>
            </ul>
        </div>
    );
  }
});

module.exports = ListboardsPanelView