var React = require('react');
var timeago = require('timeago');
var url = require('url');

var state = require('../state');
var page = require('../page');

var UserMenu = require('./user-menu');

var NavBar = React.createClass({
    mixins: [
        state.mixins.editorModeForceUpdate
    ],

    itemTitle: function() {
        var item = this.props.item;
        if(item) {
            return (
                <li className="item-name">
                    <a href="javascript:void(0)">
                        { item.favicon && <img src={item.favicon} alt="favicon" className="icon"/>}
                        { item.title && <span className="title">{item.title}</span>}
                    </a>
                </li>
            )
        }
    },

    itemUrl: function() {
        var item = this.props.item;
        if(item && item.url) {
            var parsedUrl = url.parse(item.url);
            return (
                <li className="item-url">
                    <a href={item.url} target="_blank" title={item.url}>
                        <i className="glyphicon glyphicon-link" />
                        <span>{parsedUrl.host}</span>
                    </a>
                </li>
            )
        }
    },

    itemTime: function() {
        var item = this.props.item;
        if(item && item.createdAt) {
            return (
                <li className="item-time">
                    <a href="javascript:void(0)" title={item.createdAt.toLocaleString()}>
                        <i className="glyphicon glyphicon-time" />
                        <time dateTime={item.createdAt.toISOString()}>{timeago(item.createdAt)}</time>
                    </a>
                </li>
            )
        }
    },

    render: function() {
        var item = this.props.item;
        return (
            <header id="top" className={"row navbar navbar-static-top navbar-for-item"}>
                <div className="container-fluid">
                    <nav className="collapse navbar-collapse" role="navigation">
                        <ul className="nav navbar-nav navbar-left">
                            <li><a href="javascript:void(0)"><i className="glyphicon glyphicon-chevron-right"></i></a></li>
                            { this.itemTitle() }
                            { this.itemUrl() }
                            { this.itemTime() }
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            { item && <li><a href="javascript:void(0)" onClick={page.goHome}><i className="glyphicon glyphicon-home"/></a></li> }
                            { !item && <li className={ state.editorMode ? "active" : "" }>
                                            <a href="javascript:void(0)"onClick={state.toggleEditorMode.bind(state)}>
                                                <i className="glyphicon glyphicon-pencil"/></a>
                                        </li> }
                            <UserMenu item={item}/>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
});

module.exports = NavBar;