var React = require('react');

var state = require('../state');

var BookmarkletsModal = React.createClass({
    mixins: [
        state.mixins.showBookmarkletModalForceUpdate
    ],

    hide: function() {
        state.showBookmarkletModal = false;
    },

    render: function() {
        return (
            <div className={"modal fade" + (!state.showBookmarkletModal ? '': ' in')} tabIndex="-1" role="dialog" aria-hidden={!state.showBookmarkletModal} style={ {display: !state.showBookmarkletModal ? 'none': 'block'} }>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" onClick={this.hide}><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
                      <h4 className="modal-title">Our bookmarklets</h4>
                    </div>
                    <div className="modal-body">
                      <h4>You can use any of this bookmarklets</h4>

                      <ul>
                        <li><a href="javascript:<%- bookmarklet['same-page'] %>" className="label label-default">browserpipe url</a> - send only current page url and then return you to this page. It works in the same way, like you fill search box with url</li>
                        <li><a href="javascript:<%- bookmarklet['same-page-post'] %>" className="label label-info">browserpipe page</a> - send current page state. NB it can send some sensitive information presented on page</li>
                        <li>send url and ask tags</li>
                        <li>send page and ask tags</li>
                        <li>the same but also it can add predefined tags</li>
                      </ul>

                      <p>To install just move selected bookmarklet to your bookmarks bar</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" onClick={this.hide}>Ok</button>
                    </div>
                  </div>
                </div>
              </div>
        );
    }
});

module.exports = BookmarkletsModal;