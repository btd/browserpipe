/**
 * @jsx React.DOM
 */

var React = require('react'),
    selection = require('../../selection/selection');


/**
    as props uses:
        docWidth
*/

var Selector = React.createClass({    
  
  render: function() {
    var result = selection.getSelectionsText();    
    var listboardText = result[0];
    var containerText = result[1];
    var itemText = result[2];
    var folderText = result[3];

    return (
        <div id="selection-draggable">
          <ul>
              <li>{ listboardText }</li>
              <li>{ containerText }</li>
              <li>{ itemText }</li>
              <li>{ folderText }</li>
          </ul>
        </div>
    );
  }
});

module.exports = Selector