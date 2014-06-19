var React = require('react');

var state = require('../state');

var NavBar = require('./navbar');
var Home = require('./home');

var ItemHome = React.createClass({
    render: function() {
        var item = this.props.item;
        return (
            <div id="content" className="row ">
                { item && item.storageUrl ?
                    <iframe src={item.storageUrl} className="item-content"/> :
                    item.waitingUpdate ?
                        <img src="<%= url('img/loader.gif') %>" className="absolute-center"/> : null}
            </div>
        );
    }
});

var Main = React.createClass({
    mixins: [state.mixins.selectedItemForceUpdate],

    render: function() {
        var item = state.selectedItem;
        return (
            <div className={"container-fluid" + (item ? ' with-item' : '')} id="home-inner">
                <NavBar item={item} />
                { item ?
                 <ItemHome item={item}/>:
                 <Home/>
                }
            </div>
        );
    }
});

module.exports = Main;