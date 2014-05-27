/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    $ = require('jquery'),
    browser = require('../../browser/main'),
    AdvanceSearchModalComponent = require('../modal/advancesearch');

var SearchBoxComponent = React.createClass({
  advanceSearchClicked: function(e) {
    e.preventDefault();
    AdvanceSearchModalComponent.render();
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    var parentId = _state.pending._id;
    browser.createAndOpen(
      parentId,
      url,
      function(item) {
        $('#url-input').val('');
      }
    );
  },
  render: function() {
   return <div>
            <span className="home-input">
              <input type="text" placeholder="Search or add an URL" id="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} />
              <input type="button" id="url-btn" value="Go"  onClick={this.navigateEnteredURL} />
              <a className="advance-search" href="#" onClick={this.advanceSearchClicked} >advance search</a>
            </span>
          </div>
  }
});


module.exports = SearchBoxComponent
