var React = require('react');

var state = require('../state');
var key = require('../key').keyMap;

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

function setCaretPosition(el, caretPos) {
    if(!el) return false;

    el.value = el.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)


    if (el.createTextRange) {
        var range = el.createTextRange();
        range.move('character', caretPos);
        range.select();
        return true;
    }

    else {
        // (el.selectionStart === 0 added for Firefox bug)
        if (el.selectionStart || el.selectionStart === 0) {
            el.focus();
            el.setSelectionRange(caretPos, caretPos);
            return true;
        }

        else  { // fail city, fortunately this never happens (as far as I've tested) :)
            el.focus();
            return false;
        }
    }

}


var Search = React.createClass({
    getInitialState: function() { return {}; },

    getInitialSuggestionsState: function() {
        return {
            suggestions: null,
            activeSuggestion: -1
        }
    },

    onSearchSubmit: function(event) {
        return false;
    },

    setSearch: function() {
        state.search = parseSearch(this.getSearchValue());
    },

    getSearchValue: function() {
        var input = this.refs.inputSearch.getDOMNode();
        var search = input.value;

        return (search || '').trim();
    },

    preventDefaultMoving: function(e) {
        var specialKey = key[e.keyCode];
        if(specialKey == 'up' || specialKey == 'down') {
            e.preventDefault();
        }
    },

    trySuggest: function(e) {
        var input = this.refs.inputSearch.getDOMNode(), pos = input.selectionStart;
        var specialKey = key[e.keyCode];
        console.log(specialKey);
        switch(specialKey) {
            case 'esc':
                this.setState(this.getInitialSuggestionsState());
                return;

            case 'up':
                if(this.state.suggestions) {
                    var act = this.state.activeSuggestion < 0 ? this.state.suggestions.length : this.state.activeSuggestion;
                    this.setState({ activeSuggestion: (act - 1) % (this.state.suggestions.length) })
                    return;
                }
                break;
            case 'down':
                if(this.state.suggestions) {
                    this.setState({ activeSuggestion: (this.state.activeSuggestion + 1) % (this.state.suggestions.length) })
                    return;
                }
                break;

            case 'enter':
                if(this.state.suggestions && this.state.activeSuggestion >= 0) {
                    var search = (input.value || '');
                    var tokens = splitByTokenBegin(search);

                    tokens = tokens.map(function(t) {
                        if(t[2] <= pos && pos <= t[3]) {
                            return t[1] + this.state.suggestions[this.state.activeSuggestion];
                        } else {
                            return t[1] + t[0];
                        }
                    }, this);
                    input.value = tokens.join(' ');
                } else {
                    this.setSearch();
                }
                this.setState(this.getInitialSuggestionsState());
                break;
            default:
                if(input.selectionStart == input.selectionEnd) {
                    var search = (input.value || '');
                    if(isFiltering(search)) {
                        var tokens = splitByTokenBegin(search);
                        var token = tokens.filter(function(t) {
                            return t[2] <= pos && pos <= t[3];
                        })[0];

                        console.log(token);
                        if(Array.isArray(token) && token[0] != '') {
                            return this.setState({ suggestions: state.tagIndex.get(token[0]), pos: pos });
                        }
                    }
                }

        }

        this.setState(this.getInitialSuggestionsState());
    },

    setSuggestionOnPos: function(suggestion) {
        var pos = this.state.pos;
        if(typeof pos == 'number') {
            var input = this.refs.inputSearch.getDOMNode();
            var search = (input.value || '');
            var tokens = splitByTokenBegin(search);

            tokens = tokens.map(function(t) {
                if(t[2] <= pos && pos <= t[3]) {
                    return t[1] + suggestion;
                } else {
                    return t[1] + t[0];
                }
            }, this);
            input.value = tokens.join(' ');
            this.setState(this.getInitialSuggestionsState(), function() {
                input.focus();
            });
        }
    },

    render: function() {
        return (
        <form id="search" className="col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3" onSubmit={ this.onSearchSubmit }>
            <div className="form-group">
                <div className="input-group">
                  <input ref="inputSearch" placeholder="Search or add an URL" autoFocus="autofocus" onKeyDown={this.preventDefaultMoving} onKeyUp={this.trySuggest} className="form-control" type="text"/>
                  <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.setSearch}>Go!</button>
                  </span>
                </div>
                { this.state.suggestions &&
                <div className="dropdown open suggestions">
                  <ul className="dropdown-menu open">
                    {
                        this.state.suggestions.map(function(suggestion, idx) {
                            return <li className={idx == this.state.activeSuggestion ? 'active': ''}>
                                <a href="javascript:void(0)" onClick={this.setSuggestionOnPos.bind(null, suggestion)}>{suggestion}</a>
                            </li>
                        }, this)
                    }
                  </ul>
                </div>
                }

                <p className="help-block"><a className="advance-search" href="#">advanced search</a></p>
            </div>
        </form>
        )
    }
})

module.exports = Search;