/**
 * @jsx React.DOM
 */

var React = require('React');

var ListboardView = React.createClass({     
  getListboardWidth: function() {
    if(this.props.docWidth > 575)
      return this.props.docWidth - 180;  //document - listboard panel
    else
      return this.props.docWidth; //document
  },
  getContainersWidth: function() {
    return 4000; 
  },
  getContainersHeight: function() {
    var height = this.props.docHeight - 47 - 21 - 20; //document - top bar - footer - scroll (for now)
    if(this.props.docWidth <= 575)
      height = height - 36; //height - listboard panel height
    return height;
  },
  render: function() {
    return (        
        <div class="listboard" style={{width: this.getListboardWidth()}} >
            <ul class="containers" style={{
                    width: this.getContainersWidth(),
                    height: this.getContainersHeight()
                }}>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
                <li class="container">Container</li>
            </ul>
        </div>
    );
  }
});

module.exports = ListboardView