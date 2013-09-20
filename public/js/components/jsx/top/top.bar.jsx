/**
 * @jsx React.DOM
 */

var React = require('React');

var TobBarView = React.createClass({
  render: function() {
    return (        
        <div id="top-bar">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <ul id="account-nav" class="nav pull-right">
                        <li class="dropdown nav-option">
                            <a href="#" data-toggle="dropdown" class="dropdown-toggle">
                                <i class="icon-user"></i>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a tabindex="-1" href="/settings">
                                        <i class="icon-none"><span>Settings</span></i>
                                    </a>
                                </li>
                                <li>
                                <a tabindex="-1" href="/help">
                                    <i class="icon-none"> <span>Help</span></i>
                                </a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a tabindex="-1" href="/logout"> 
                                        <i class="icon-none"><span>Logout </span></i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <a href="/" data-original-title="" class="pull-left brand">
                        <h1>{this.props.docWidth > 575 ? 'Listboard.it' : 'L'}</h1>
                    </a>
                    <div id="search-cont">
                        <button id="search-btn" type="submit" class="btn"> 
                            <i class="icon-search"></i> Search
                        </button>
                        <span id="search-span">
                            <input id="search-box" type="text" class="uncompressed"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
  }
});

module.exports = TobBarView