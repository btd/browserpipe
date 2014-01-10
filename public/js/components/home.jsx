/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    websocket = require('../websocket/websocket'),
    Container= require('./container'),
    Tab= require('./tab');

var HomeComponent = React.createClass({    
  getInitialState: function() {
      return {     
          archive: this.props.archive,
          browser: this.props.browser,
          selected: this.props.selected,
      };
  },
  newContainerClicked: function() {
    _state.serverAddItemToItem(this.state.browser._id, { type: 2 }, function(item) {
      //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
      //We should fix this by sending crud request to server via websockets instead of ajax.
      setTimeout(function() {  page('/item/' + item._id) }, 500); 
    });
  },
  newTabClicked: function() {
    _state.serverAddItemToItem(this.state.selected._id, { type: 0 }, function(item) {
      //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
      //We should fix this by sending crud request to server via websockets instead of ajax.
      setTimeout(function() { page('/item/' + item._id) }, 500); 
    });
  },
  homeOptionClicked: function() { 
    page('/item/' + this.state.selected.parent);
  },
  isContainerActive: function(container) {
    return (this.state.selected._id === container._id) ||
      (_.contains(container.items, this.state.selected._id));
  },
  isTabActive: function(tab) {
    return this.state.selected._id === tab._id;
  },
  navigateToURL: function(){
     var url = this.refs.urlInput.getDOMNode().value.trim();
     websocket.send('navigate', { itemId: this.state.selected._id, url: url });
  },
  render: function() {
    var self = this;
    var browserMode = this.state.selected && (this.state.selected.type === 0 || this.state.selected.type === 1);
    return (
      <div className="content">
        <div className={"browser-commands" + (browserMode? "": " hide")} >
	  <input type="text" className="url-input" ref="urlInput" value={(browserMode? this.state.selected.url : "")} />
	  <input type="button" className="url-btn" value="Go"  onClick={this.navigateToURL} />
	  <div className="home-option" onClick={ this.homeOptionClicked } >
	    <i className="icon-th-large"></i>
	  </div>
        </div>
        <div className="home" >
	  <div className={"home-top" + (browserMode? " hide": "")}>
            <div className="search-box">
              <input type="text" placeholder="Find a tab"/>
            </div>
          </div>
        
          <div className={"containers" + (browserMode? " hide": "")}>
            {                   
              this.state.browser.items.map(function(containerId) {
                var container = _state.getItemById(containerId);
                return <Container container={ container } active={ self.state.selected && self.state.selected._id == container._id } /> 
              })
            }  
            <div className="new-container" onClick={ this.newContainerClicked }><i className="icon-plus"></i></div>
          </div>
          
          <div className="container-items">
	    {
              this.state.browser.items.map(function(containerId) {
                var container = _state.getItemById(containerId);
		return <div className={"items" + (self.isContainerActive(container)? " active": "")}>
		         {
                            container.items.map(function(tabId){
                              var tab = _state.getItemById(tabId);
                              return  <Tab tab={ tab } active={ self.isTabActive(tab) } browserMode={ browserMode } />
			    })
			 }
                         <div className={"new-tab" + (browserMode? " hide": "")} onClick={ self.newTabClicked }>
			   <i className="icon-plus"></i>
			 </div>
		       </div>
              })
	    }
          </div>
        </div>
      </div>
    );
  }
});


module.exports.render = function (
    archive,
    browser,
    selected
  ) {
  return React.renderComponent(
    <HomeComponent 
      archive={archive}
      browser={browser}
      selected={selected} />,
    document.getElementById('body-inner')
  );
};
