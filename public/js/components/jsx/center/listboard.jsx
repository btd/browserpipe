/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Container = require('components/built/center/container');

var ListboardView = React.createClass({  
  getListboardWidth: function() {    
    return this.props.docWidth; 
  },
  getContainersWidth: function() {
    return this.props.selectedListboard.containers.length * 264; //(260px; = container width) + (4 = container margin)
  },
  getContainersHeight: function() {
    var height = this.props.docHeight - 47 - 21 - 20; //(47 = top bar height)(21 = footer height) (20 = horizontal scrollbar height)
    if(this.props.docWidth > 575) //(575 = responsive design limit)
      height = height - 48; //(72 = listboard panel height)
    else
      height = height - 36 //(36 = listboard panel height)
    return height;
  },
  getContainersStyle: function() {
    return {
        width: this.getContainersWidth(),
        height: this.getContainersHeight()
    };
  },
  render: function() {
    var self = this;
    return (        
        <div class="listboard" style={{width: this.getListboardWidth()}} >
            <ul class="containers" style={this.getContainersStyle()} >
                {                    
                    this.props.selectedListboard.containers.map(function(container) {
                        return <Container container= {container} containersHeight={ self.getContainersHeight() } />
                    })
                }
            </ul>
        </div>
    );
  }
});

module.exports = ListboardView