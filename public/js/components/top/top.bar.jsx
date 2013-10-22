/**
 * @jsx React.DOM
 */

var React = require('react');

var TobBarComponent = React.createClass({
  render: function() {
    return (        
        <div id="top-bar">
            <div className="navbar-inner">
                <div className="container-fluid">
                    <ul id="account-nav" className="nav pull-right">
                        <li className="dropdown nav-option">
                            <a href="#" data-toggle="dropdown" className="dropdown-toggle">
                                <i className="icon-user"></i>
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a tabindex="-1" href="/settings">
                                        <i className="icon-none"><span>Settings</span></i>
                                    </a>
                                </li>
                                <li>
                                <a tabindex="-1" href="/help">
                                    <i className="icon-none"> <span>Help</span></i>
                                </a>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <a tabindex="-1" href="/logout"> 
                                        <i className="icon-none"><span>Logout </span></i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <a href="/" data-original-title="" className="pull-left brand">
                        <h1>{this.props.docWidth > 575 ? 'Listboard.it' : 'L'}</h1>
                    </a>
                    <div id="search-cont">
                        <button id="search-btn" type="submit" className="btn"> 
                            <i className="icon-search"></i> Search
                        </button>
                        <span id="search-span">
                            <input id="search-box" type="text" className="uncompressed"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
  }
});

module.exports = TobBarComponent