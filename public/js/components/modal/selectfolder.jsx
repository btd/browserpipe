/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    Tab= require('../common/tab'),
    ArchiveComponent = require('../sidebar/archive'); //TODO: we can move this to common folder

var SelectFolderModalComponent = React.createClass({
  getInitialState: function() {
    return {
      selectedItem: this.props.selectedItem,
      selectedFolderToArchive: _state.archive
    };
  },
  selectFolderToArchive: function(folder) {
    this.setState({ selectedFolderToArchive: folder });
  },
  archiveItem: function(e) {
    var message = "Tab archived";
    if(this.state.selectedItem.deleted)
      message = "Tab restored";
    else if(util.isItemInArchive(this.state.selectedItem, _state))
      message = "Tab moved";
    _state.moveItem(
      this.state.selectedItem._id,
      this.state.selectedFolderToArchive._id,
      function() {
        $('#select-folder-modal').modal('hide');
        var msg = Messenger().post({
          message: message,
          hideAfter: 6
        });
    });
  },
  getLabelByItemStatus: function(deletedText, pendingText, archivedText) {
    if(this.state.selectedItem)
      if(this.state.selectedItem.deleted) return deletedText;
      else if(util.isItemInArchive(this.state.selectedItem, _state)) return archiveText;
      else return pendingText;
    else return '';
  },
  render: function() {
    return (
      <div className="modal fade" id="select-folder-modal" tabindex="-1" role="dialog" aria-labelledby="selectFolder" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <Tab
                tab={ this.state.selectedItem }
                selectedItem={ this.state.selectedItem }
                showDropdown={ false }
                viewScreenshot={ false } />
              <h4 className="modal-title" id="myModalLabel">
                { this.getLabelByItemStatus("Select folder to restore", "Select folder to archive", "Select folder to move") }
              </h4>
            </div>
            <div className="modal-body">
              <ArchiveComponent
                viewScreenshot={ false }
                selectedFolder={ this.state.selectedFolderToArchive }
                selectFolderToArchive={ this.selectFolderToArchive } />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-warning" onClick={ this.archiveItem }>
                { this.getLabelByItemStatus("Restore here", "Archive here", "Move here") }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var selectedFolderModalComponent;

module.exports.render = function (
    selectedItem
  ) {
  if(!selectedFolderModalComponent)
    selectedFolderModalComponent = React.renderComponent(
      <SelectFolderModalComponent
        selectedItem={selectedItem} />,
      document.getElementById('select-folder-modal-section')
    );
  else
    selectedFolderModalComponent.setState({
      selectedItem: selectedItem
    });
  $('#select-folder-modal').modal('show');
};

