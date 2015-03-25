var React = require('react');
var bytes = require('bytes');
var page = require('../page');

var DropdownMixin = require('./dropdown-mixin');

var state = require('../state');

var UserMenu = React.createClass({
    mixins: [DropdownMixin, state.mixins.showScreenshotsForceUpdate],

    usageString: function() {
        var size = state.size();
        return  bytes(size) +
                ' of ' +
                bytes(state.config.userLimit) +
                ' (' +
                (size > 0 ? (state.config.userLimit / 100 / size).toFixed(2) : 0) +
                '% used)';
    },

    markDeleted: function() {
        var item = this.props.item;
        item.markDeleted();
        page.goHome();
    },

    toggleShowScreenshots: function() {
        state.showScreenshots = !state.showScreenshots;
    },

    render: function() {
        var item = this.props.item;
        return (
        <li className={"nav-user dropdown" + (this.state.open ? " open" : "") }>
            <a href="javascript:void(0)" onClick={this.toggleOpen}>
                <i className={"glyphicon " + (item ? "glyphicon-cog" : "glyphicon-user")} />
            </a>
            <ul className="dropdown-menu">
                { item && <li><a href="javascript:void(0)" onClick={this.markDeleted}>Remove</a></li> }
                { item && <li className="divider"></li> }
                <li className="username"><span className="dropdown-header">{state.user.name}</span></li>
                <li className="space-usage"><span className="dropdown-header">{this.usageString()}</span></li>
                <li className="divider"></li>
                <li className="space-usage">
                    <span className="dropdown-header">
                        <input type="checkbox" checked={state.showScreenshots} onChange={this.toggleShowScreenshots}/> Show screenshots?
                    </span>
                </li>
                <li className="divider"></li>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        </li>
        );
    }
});

module.exports = UserMenu;