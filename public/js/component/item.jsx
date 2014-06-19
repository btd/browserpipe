var React = require('react');

var page = require('../page');

var state = require('../state');

var Tag = require('./tag');

var UrlItem = React.createClass({
    go: function() {
        var item = this.props.item;
        page.goItem(item);
    },

    tags: function() {
        var item = this.props.item;

        return (
            <div className="tags">
            {
                item.tags.map(function(tag) {
                    return <Tag key={tag} tag={tag}/>
                })
            }
            { state.editorMode && <a href="javascript:vold(0)">+</a> }
            </div>
        );
    },

    render: function() {
        var item = this.props.item;
        return (
            <div className="item" key={item._id} title={item.title}>
                <div className="name" onClick={this.go}>
                    {item.favicon && <img src={item.favicon} className="icon"/>}
                    <div className="title">{item.title}</div>
                </div>
                { state.editorMode && <a href="javascript:vold(0)" className="close" onClick={item.markDeleted.bind(item)}>&times;</a> }
                { item.tags.length ? this.tags() : null }
                { state.showScreenshots && item.screenshot && <img src={item.screenshot}/> }
            </div>
        );
    }
});

module.exports = UrlItem;