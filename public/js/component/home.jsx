var React = require('react');

var state = require('../state');

var UrlItem = require('./item');
var Search = require('./search');

var Home = React.createClass({
    mixins: [
        state.mixins.itemsForceUpdate,
        state.mixins.showScreenshotsForceUpdate,
        state.mixins.isItemsLoadingForceUpdate,
        state.mixins.editorModeForceUpdate
    ],

    showBookmarklets: function() {
        state.showBookmarkletModal = true;
    },

    render: function() {
        return (
            <div id="content" className={ state.editorMode ? "editing" : "" }>
                <h1 id="logo" className="center-block"><img src={"<%= url('img/logo/logo.png') %>"} alt="Browserpipe"/></h1>
                <div className="row">
                    <Search/>
                </div>
                <p className="text-centered">
                    or install our <a href="javascript:void(0)" onClick={this.showBookmarklets}>bookmarklets</a> to add tabs directly from your browser
                </p>
                <div className="row">
                    <div className="items col-lg-12">
                    {
                        state.items.reduce(function(acc, item) {
                            if(!item.deleted) acc.push(<UrlItem key={item._id} item={item}/>);
                            return acc;
                        }, [])
                    }
                    { state.isLoadingItems && <img src={"<%= url('img/loader-small.png') %>"} alt="Loading..."/> }
                    </div>
                </div>
            </div>
        )
    }
})

module.exports = Home;