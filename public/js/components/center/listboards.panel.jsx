/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    page = require('page'),
    React = require('react');

require('jquery-ui');

var ListboardsPanelComponent = React.createClass({    
    getListboardsPanelWidth: function() {
        return this.props.width;
    },
    getListboardsWidth: function() {
        var extensionButtonWidth = 0;
        if(!this.props.isExtensionInstalled){
            if(this.props.width > 575)
                extensionButtonWidth = 306; //(270 = extension button width) + (12 = listboard padding) + (24 = listboard margin)
            else
                extensionButtonWidth = 494; //(270 = listboard width) + (12 = listboard padding) + (12 = listboard margin)
        }
        if(this.props.width > 575) //(575 = responsive design limit)
            return this.props.listboards.length * 126 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (24 = listboard margin) + (11 = Add buton)
        else
            return this.props.listboards.length * 114 + extensionButtonWidth + 51; //(90 = listboard width) + (12 = listboard padding) + (12 = listboard margin)  + (11 = Add buton)
    },    
    getListboardsPanelStyle: function() {
        var visible = this.props.visible? "block" : "none";
        return { width: this.getListboardsPanelWidth(), display: visible };
    },
    getListboardStyle: function() {        
        return  { width: this.getListboardsWidth() };
    },
    getExtensionButton: function() {
        if(!this.props.isExtensionInstalled)
            return (
                <a className="chrome-extension-warning" href="#installExtensionModal" data-toggle="modal">
                    You have not installed the sync extension in this browser, click here to install it
                </a>
            );
        else
            return null;
    },
    installChromeExtension: function() {        
        _state.installChromeExtension();
    },
    addEmptyListboardAndSelectIt: function(e) {
        e.preventDefault();
        _state.serverSaveListboard({
            type: 1
        }, function(listboard){
            page('/listboard/' + listboard._id);
        })
    },
    handleListboardClick: function(e) {
        e.preventDefault();        
        e.stopPropagation();
        var elementId = e.target.id;
        if(!elementId)
            elementId = $(e.target).parents('.listboard-selector:first').attr('id');
        var listboardId = elementId.substring(3);
        if(e.ctrlKey){      
          var added = _state.addOrRemoveSelectedListboard(listboardId);
          var $el = $("#" + elementId);
          if(added)
            $el.addClass('selection-selected');
          else
            $el.removeClass('selection-selected');
        }
        else            
            this.props.navigateToListboard(listboardId);
    },


    ///DRAG AND DROPPPPPPP
    componentDidMount: function() {      
      this.configureSortable();
      this.configureDroppable();    
    },  
    componentDidUpdate: function(prevProps, prevState, rootNode) {
       // this.removeDraggable();
        //this.configureDraggable();
    },
    configureSortable: function() {
        $( '.browser-listboards' ).sortable({
            connectWith: '.custom-listboards',
            helper: function(event, el) {
                var myclone = el.clone();
                $('body').append(myclone);
                return myclone;
            }
        });
        $( '.custom-listboards' ).sortable({
            connectWith: '.browser-listboards',
            helper: function(event, el) {
                var myclone = el.clone();
                $('body').append(myclone);
                return myclone;
            }
        });
    },
    configureDroppable: function() {    
        var that = this;
        $(".listboard-selector").droppable({
            over: function(event, ui) {
                var listboardId = $(this).attr('id');                          
                that.props.navigateToListboard(listboardId.substring(3));
            },
            tolerance: 'pointer'
        }); 
    },
    configureDraggable: function() {
        /*$('.listboard-selector').draggable({
            //appendTo: 'body',
            //scroll: false,
            //revert: 'invalid',
            //helper: 'clone',
            zIndex: 3000
        });*/
    },
    ///DRAG AND DROPPPPPPP


    removeDraggable: function() {
        $('.listboards-panel .ui-draggable').draggable( "destroy" );
    },
    getListboardClass: function(listboard) {
        if(listboard.type === 0) return "browser-listboard-selector";
        else return "custom-listboard-selector";
    },
    renderListboardOption: function(listboard) {
        return <li             
            className={(this.props.selectedListboard._id === listboard._id ? "listboard-selector selected " : "listboard-selector ") + this.getListboardClass(listboard) }            
            id={'li_' + listboard._id}
            onClick={this.handleListboardClick}
            title={listboard.label? listboard.label : 'Unnamed'}> 
                { listboard.type === 0 ? <img src="/img/common/chrome-logo.png" alt="Chrome Logo" /> : null }
                <span>{listboard.label? listboard.label : 'Unnamed'}</span>
            </li > 
    },
    render: function() {
        var self = this;
        return  (
            <div className="listboards-panel" style={ this.getListboardsPanelStyle() }>                                 
                <div className="listboards" style={ this.getListboardStyle() }>                
                    { this.getExtensionButton() }
                    <ul className="browser-listboards">
                    {                    
                        this.props.listboards
                            .filter(function(l) {return l.type === 0 } )
                            .map(function(listboard) {
                                return self.renderListboardOption(listboard)
                            })
                    }
                    </ul>
                    <a className="add-listboard btn" onClick={this.addEmptyListboardAndSelectIt}  href="#" title="Add listboard" data-toggle="tooltip">
                        <i className="icon-plus"></i>
                    </a>
                    <ul className="custom-listboards">
                    {                    
                        this.props.listboards
                            .filter(function(l) { return l.type === 1 } )
                            .map(function(listboard) {
                                return self.renderListboardOption(listboard)
                            })
                    }
                    </ul>                    
                </div>
                
                <div id="installExtensionModal" className="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Install Listboard.it Extension</h3>
                  </div>
                  <div className="modal-body">
                    <p>Press here</p>
                    <button onClick={this.installChromeExtension}>Install Listboard.it sync extension</button>
                  </div>
                  <div className="modal-footer">
                    <button className="btn" data-dismiss="modal" aria-hidden="true">Close</button>
                    <button className="btn btn-primary">Save changes</button>
                  </div>
                </div>
        </div>);
    }
});

module.exports = ListboardsPanelComponent