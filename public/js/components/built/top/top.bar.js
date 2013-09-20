/**
 * @jsx React.DOM
 */

var React = require('React');

var TobBarView = React.createClass({displayName: 'TobBarView',
  render: function() {
    return (        
        React.DOM.div( {id:"top-bar"}, 
            React.DOM.div( {className:"navbar-inner"}, 
                React.DOM.div( {className:"container-fluid"}, 
                    React.DOM.ul( {id:"account-nav", className:"nav pull-right"}, 
                        React.DOM.li( {className:"dropdown nav-option"}, 
                            React.DOM.a( {href:"#", 'data-toggle':"dropdown", className:"dropdown-toggle"}, 
                                React.DOM.i( {className:"icon-user"})
                            ),
                            React.DOM.ul( {className:"dropdown-menu"}, 
                                React.DOM.li(null, 
                                    React.DOM.a( {tabindex:"-1", href:"/settings"}, 
                                        React.DOM.i( {className:"icon-none"}, React.DOM.span(null, "Settings"))
                                    )
                                ),
                                React.DOM.li(null, 
                                React.DOM.a( {tabindex:"-1", href:"/help"}, 
                                    React.DOM.i( {className:"icon-none"},  React.DOM.span(null, "Help"))
                                )
                                ),
                                React.DOM.li( {className:"divider"}),
                                React.DOM.li(null, 
                                    React.DOM.a( {tabindex:"-1", href:"/logout"},  
                                        React.DOM.i( {className:"icon-none"}, React.DOM.span(null, "Logout " ))
                                    )
                                )
                            )
                        )
                    ),
                    React.DOM.a( {href:"/", 'data-original-title':"", className:"pull-left brand"}, 
                        React.DOM.h1(null, this.props.docWidth > 575 ? 'Listboard.it' : 'L')
                    ),
                    React.DOM.div( {id:"search-cont"}, 
                        React.DOM.button( {id:"search-btn", type:"submit", className:"btn"},  
                            React.DOM.i( {className:"icon-search"}), " Search "                        ),
                        React.DOM.span( {id:"search-span"}, 
                            React.DOM.input( {id:"search-box", type:"text", className:"uncompressed"})
                        )
                    )
                )
            )
        )
    );
  }
});

module.exports = TobBarView