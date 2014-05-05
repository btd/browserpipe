/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    ArchiveComponent = require('../sidebar/archive'); //TODO: we can move this to common folder

var BookmarkletArchiveComponent = React.createClass({
  getInitialState: function() {
    return {
      selectedFolder: this.props.selectedFolder
    };
  },
  selectFolderToArchive: function(folder) {
    _state.selectedFolder = folder;
  },
  closeBookmarklet: function() {
    window.parent.postMessage("destroy", "*");
  },
  archiveItem: function(e) {
    window.parent.postMessage("save_" + this.state.selectedFolder._id, "*");
  },
  render: function() {
    return (
      <div className="bookmarklet-archive">
        <div className="buttons">
          <button type="button" className="btn btn-warning" onClick={ this.archiveItem }>Archive here</button>
          <button type="button" className="btn btn-default" onClick={ this.closeBookmarklet }>Close</button>
        </div>
        <div className="content">
          <ArchiveComponent
            viewScreenshot={ false }
            selectedFolder={ this.state.selectedFolder }
            selectFolderToArchive={ this.selectFolderToArchive } />
        </div>
      </div>
    );
  }
});


module.exports.render = function (
    selectedFolder
  ) {
  return React.renderComponent(
    <BookmarkletArchiveComponent
      selectedFolder={selectedFolder} />,
    document.getElementById('bookmarklet')
  );
};
