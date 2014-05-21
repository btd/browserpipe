/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    Tab= require('../common/tab'),
    ArchiveComponent = require('../sidebar/archive'); //TODO: we can move this to common folder

var AdvanceSearchModalComponent = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  performSearch: function(e) {
  },
  render: function() {
    return (
      <div className="modal fade" id="advance-search-modal" tabindex="-1" role="dialog" aria-labelledby="selectFolder" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 className="modal-title" id="myModalLabel">Advance search</h4>
            </div>
            <div className="modal-body">
              <form role="form">
                <div className="form-group">
                  <select className="form-control">
                    <option>All</option>
                    <option>Pending</option>
                    <option>Current Folder</option>
                    <option>Specific Folder</option>
                    <option>Trash</option>
                  </select>
                </div>
                <div className="form-group">
                  <label for="asearch_words">Has the words</label>
                  <input type="text" id="asearch_words" className="form-control" placeholder="Eg. 'plane', 'world' or 'speed'" />
                  <p className="help-block">Enter words you remember from the page</p>
                </div>
                <div className="form-group">
                  <label for="asearch_domain">From specific domain</label>
                  <input type="text" id="asearch_domain" className="form-control" placeholder="Eg. 'news.combinator.com' or 'washigntonpost'" />
                  <p className="help-block">Enter full/partial domain of the page</p>
                </div>
                <div className="form-group">
                  <label for="asearch_referrer">I opened it from</label>
                  <input type="text" id="asearch_referrer" className="form-control"  placeholder="Eg. 'google' or 'reddit.com'" />
                  <p className="help-block">Enter full/partial URL from where you open the page</p>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <a href="#" className="modal-close-btn" data-dismiss="modal">close</a>
              <button type="button" className="orange-btn" onClick={ this.performSearch }>Search</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var advanceSearchModalComponent;

module.exports.render = function (
  ) {
  if(!advanceSearchModalComponent)
    advanceSearchModalComponent = React.renderComponent(
      <AdvanceSearchModalComponent />,
      document.getElementById('advance-search-modal-section')
    );
  else
    advanceSearchModalComponent.setState({
    });
  $('#advance-search-modal').modal('show');
};

