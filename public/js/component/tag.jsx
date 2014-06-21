var React = require('react');

var state = require('../state');

var Tag = React.createClass({

    render: function() {
        var tag = this.props.tag;
        return (
            <span className="tag">{tag} { state.editorMode ?
                <a href="javascript:void(0)" onClick={this.props.onClickDelete}>&times;</a> :
                null }
            </span>
        );
    }
});

module.exports = Tag;