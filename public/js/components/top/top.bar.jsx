/**
 * @jsx React.DOM
 */

var React = require('react'),
    navigation = require('../../navigation/navigation');

var TobBarComponent = React.createClass({   
    getPanelOptionText: function() {        
        if(this.props.onePanel)
            return <span>
                        <span className="long-version">2 Panels</span>                   
                        <span className="short-version">2 P</span>
                    </span>
        else
            return <span>
                        <span className="long-version">1 Panel</span>                   
                        <span className="short-version">1 P</span>
                    </span>
    },
    executeSearch: function() {
        var query = $('#search-box').val();
        if(query.trim() === '')
             Messenger().post({
              message: 'Please complete the search box',
              type: 'error',
              hideAfter: 2
            });
        else
            navigation.performSearch(query);
    },
    handleArchiveClick: function(e) {
        navigation.navigateToFolderRoot();
    },
    handleSearchClick: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.executeSearch();
    },
    handleSearchBoxKeyPressed: function(e) {        
        if (e.keyCode === 13)
            this.executeSearch();
    },
    render: function() {
        return (
            <div id="top-bar" className="navbar">
                <div className="navbar-inner">
                    <div className="container-fluid">
                        <ul id="account-nav" className="nav pull-right">
                            <li className="nav-option"> 
                                <a draggable="false" onClick={ this.props.switchPanels } >{ this.getPanelOptionText() }</a>
                            </li>
                            <li className="nav-option"> 
                                <a draggable="false" onClick={ this.handleArchiveClick } >
                                    <span className="long-version">Archive</span>
                                    <span className="short-version">Arch</span>
                                </a>
                            </li>
                            <li className="dropdown nav-option">
                                <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
                                    <i className="icon-user"></i>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a draggable="false" href="/settings">
                                            <i className="icon-none"><span>Settings</span></i>
                                        </a>
                                    </li>
                                    <li>
                                    <a draggable="false" href="/help">
                                        <i className="icon-none"> <span>Help</span></i>
                                    </a>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a draggable="false"  href="/logout">
                                            <i className="icon-none"><span>Logout </span></i>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <a draggable="false"  href="/" data-original-title="" className="pull-left brand">
                            <h1 className="long-version">Listboard.it</h1>
                            <h1 className="short-version">L</h1>
                        </a>
                        <div id="search-cont">
                            <button id="search-btn" type="submit" className="btn" onClick={ this.handleSearchClick }>
                                <i className="icon-search"></i> Search
                            </button>
                            <span id="search-span">
                                <input id="search-box" onKeyPress={ this.handleSearchBoxKeyPressed } type="text" className="uncompressed"/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TobBarComponent