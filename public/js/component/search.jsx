var React = require('react');

var state = require('../state');
var ENTER = 13;

var tokenBegin = /(?:^|\s+)(?:\+|-)/g;

function isFiltering(search) {
    return search.match(tokenBegin);
}

function splitByTokenBegin(str) {
    var tokens = [];
    var begin = null;
    str.replace(tokenBegin, function(match, idx) {
        if(begin != null) {
            tokens.push([str.slice(begin, idx - begin + 1), match.trim(),  begin, idx]);
        }
        begin = idx + match.length;
        return match;
    });

    tokens.push([str.slice(begin), str[begin -1], begin, str.length]);

    return tokens;
}

function parseSearch(search) {
 if(isFiltering(search)) {
    var tokens = splitByTokenBegin(search);
    return tokens.reduce(function(acc, token) {
        var tokenVal = token[0], tokenSign = token[1];

        if(tokenSign == '+') {
            acc.with.push(tokenVal.trim());
        } else if(tokenSign == '-') {
            acc.without.push(tokenVal.trim());
        }
        return acc;
    }, { with: [], without: []});
 }

 return search;
}


var Search = React.createClass({
    getInitialState: function() { return {}; },

    onSearchSubmit: function(event) {
        state.search = parseSearch(this.getSearchValue());

        return false;
    },

    getSearchValue: function() {
        var input = this.refs.inputSearch.getDOMNode();
        var search = input.value;

        return (search || '').trim();
    },

    trySuggest: function() {
        var input = this.refs.inputSearch.getDOMNode(), pos = input.selectionStart;
        if(input.selectionStart == input.selectionEnd) {
            var search = (input.value || '');
            if(isFiltering(search)) {
                var tokens = splitByTokenBegin(search);
                var token = tokens.filter(function(t) {
                    return t[2] <= pos && pos <= t[3];
                })[0];

                console.log(token)
                if(Array.isArray(token) && token[0] != '') {
                    return this.setState({ suggestions: state.tagIndex.get(token[0]) });
                }
            }
        }

        this.setState({ suggestions: null });
    },

    render: function() {
        return (
        <form id="search" className="col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3" onSubmit={ this.onSearchSubmit }>
            <div className="form-group">
                <div className="input-group">
                  <input ref="inputSearch" placeholder="Search or add an URL" autoFocus="" onKeyUp={this.trySuggest} className="form-control" type="text"/>
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="submit">Go!</button>
                  </span>
                </div>
                { this.state.suggestions &&
                <div className="dropdown open">
                  <ul className="dropdown-menu open">
                    {
                        this.state.suggestions.map(function(suggestion) {
                            return <li><a href="javascript:void(0)">{suggestion}</a></li>
                        })
                    }
                  </ul>
                </div>
                }

                <p className="help-block"><a className="advance-search" href="#">advance search</a></p>
            </div>
        </form>
        )
    }
})

module.exports = Search;