/**
 * @jsx React.DOM
 */

var _state = require('../../state'),    
    _ = require('lodash'),
    extension = require('../../extension/extension'),
    page = require('page'),
    React = require('react'),
    listboardSelectorDraggable = require('../../dragging/listboard.selector'),
    selection = require('../../selection/selection'),
    navigation = require('../../navigation/navigation');

var ListboardsPanelComponent = React.createClass({            
    installChromeExtension: function() {        
        extension.installChromeExtension();
    },
    navigateItem: function(item) {
        _state.setSelected(1, item);
    },
    renderBrowsersListboardOption: function(listboard) {
        var self = this;
        return  <div key={listboard._id} className='listboard-option btn browser-listboard-option' onClick={this.navigateItem.bind(this, listboard)}>
                    <div className="option-type">
                        <img className="listboard-icon" draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" />                        
                    </div>
                    <div className="inner" >
                        <div className="listboard-label">{listboard.title? listboard.title : 'Unnamed'}</div>
                    </div>
                </div>                   
    },
    renderLaterContainerOption: function(container) {
        var self = this;
        return  <div className='container-option btn custom-listboard-option' onClick={this.navigateItem.bind(this, container)}>
                    <span className="container-label">{container.title? container.title : 'Unnamed'}</span>
                </div>     
    },
    renderArchiveListboard: function(listboard) {
        return  <div className='container-option btn archive-listboard-option' onClick={this.navigateItem.bind(this, listboard)}>
                    <span className="container-label">{listboard.title? listboard.title : 'Unnamed'}</span>
                </div>  
    },
    render: function() {
        var that = this;
        return  (
            <div className="listboards-panel" >
                <div className="listboards-panel-inner scrollable-parent">                    
                    <div className="listboards" >                         
                        <a className="extension-button btn">
                            <div className="inner">
                                <i className="icon-refresh icon-2x"></i>
                                <div className="text">Sync this browser</div>
                            </div>
                        </a>  
                        {                    
                            this.props.listboards     
                                .map(function(listboard) {
                                    listboard = _state.getItemById(listboard);
                                    return that.renderBrowsersListboardOption(listboard)
                                })
                        }  
                        { this.renderLaterContainerOption(_state.getItemById(this.props.laterBoard)) }
                        { this.renderArchiveListboard(_state.getItemById(this.props.archiveBoard)) }
                    </div>  
                </div>
        </div>);
    },
    componentDidMount: function(){
        //$('.listboards-panel-inner').perfectScrollbar({});
    },    
    componentDidUpdate: function(){
        //$('.listboards-panel-inner').perfectScrollbar('update');
    }
});

module.exports = ListboardsPanelComponent