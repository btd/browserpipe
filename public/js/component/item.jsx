var React = require('react');

var page = require('../page');

var state = require('../state');

var Tag = require('./tag');

var UrlItem = React.createClass({
    getInitialState: function() {
        return { isAddingTag: false };
    },

    go: function() {
        var item = this.props.item;
        page.goItem(item);
    },

    addTag: function() {
        // getting input value and normalizing it spaces
        var value = (this.refs.tagInput.getDOMNode().value || '').replace(/\s+/g, ' ');
        var item = this.props.item;
        if(value != '' && item.tags.indexOf(value) < 0) {
            state.tagIndex.add(value);
            item.tags.push(value);
            item.save();
            this.toggleAddingTag();
        }
        return false;
    },

    tagEditor: function() {
        return (
            <form onSubmit={this.addTag}>
                <span className="input-group">
                  <input ref="tagInput" type="text" className="form-control input-xs" autoFocus="autofocus"/>
                  <span className="input-group-btn">
                    <button className="btn btn-default btn-xs" type="button" onClick={this.addTag}>
                        <i className="glyphicon glyphicon-ok"/>
                    </button>
                    <button className="btn btn-default btn-xs" type="button" onClick={this.toggleAddingTag}>
                        <i className="glyphicon glyphicon-remove"/>
                    </button>
                  </span>
                </span>
            </form>
        );
    },

    toggleAddingTag: function() {
        this.setState({ isAddingTag: !this.state.isAddingTag });
    },

    deleteTag: function(tag) {
        var item = this.props.item;
        item.tags = item.tags.filter(function(t) { return t != tag; });

        item.save();
    },

    tags: function() {
        var item = this.props.item;

        return (
            <div className="tags">
            {
                item.tags.map(function(tag) {
                    return <Tag key={tag} tag={tag} onClickDelete={this.deleteTag.bind(null, tag)}/>
                }, this)
            }
            { state.editorMode &&
                (this.state.isAddingTag ?
                    this.tagEditor() :
                    <a href="javascript:void(0)" onClick={this.toggleAddingTag}>+</a>) }
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
                { state.editorMode && <a href="javascript:void(0)" className="close" onClick={item.markDeleted.bind(item)}>&times;</a> }
                { item.tags.length > 0 || state.editorMode ? this.tags() : null }
                { state.showScreenshots && item.screenshot && <img src={item.screenshot}/> }
            </div>
        );
    }
});

module.exports = UrlItem;