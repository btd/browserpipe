/**
 * @jsx React.DOM
 */

var React = require('react');


/**
    as props uses:
        docWidth
*/

var Selector = React.createClass({    

  getSelectionText: function(count, singularText, pluralText) {
    return count > 0 ? (" (" + count + " " + (count > 1 ? pluralText : singularText) + ")") : "";
  },
  getSelectionsText: function() {    
    var listboardText = '', containerText = '', itemText = '', folderText = '';
    var listboardCount = this.props.selection.listboards.length;    
    var containerCount = this.props.selection.containers.length;
    var itemCount = this.props.selection.items.length;
    var folderCount = this.props.selection.folders.length;
    if((listboardCount + containerCount + itemCount + folderCount) > 0) {
      listboardText = this.getSelectionText(listboardCount, "listboard",  "listboards");
      containerText = this.getSelectionText(containerCount, "container",  "containers");
      itemText = this.getSelectionText(itemCount, "item",  "items");
      folderText = this.getSelectionText(folderCount, "folder",  "folders");
    }
    return [listboardText, containerText, itemText, folderText]
  },
  render: function() {
    var result = this.getSelectionsText();    
    var listboardText = result[0];
    var containerText = result[1];
    var itemText = result[2];
    var folderText = result[3];

    var text = "selected" + listboardText + containerText + itemText + folderText;
    return (
        <span>
            <div id="selection-draggable">
              <ul>
                  <li>{ listboardText }</li>
                  <li>{ containerText }</li>
                  <li>{ itemText }</li>
                  <li>{ folderText }</li>
              </ul>
            </div>
            <span className="selection">{ text }</span>
        </span>
    );
  }
});

module.exports = Selector