/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    page = require('page'),
    _ = require('lodash'),
    React = require('react');

require('jquery-ui');

var ItemComponent = React.createClass({   
  getTitle: function() {
    if(this.props.item.title)
      return this.props.item.title.trim();
    else
      return this.props.item.url;
  }, 
  getScreenshot: function() {
    return this.props.item.screenshot || "/img/no_screenshot.png";
  },
  navigateToItem: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.ctrlKey){      
      var added = _state.addOrRemoveSelectedItem(this.props.item._id);
      var $el = $(this.refs.item.getDOMNode());
      if(added)
        $el.addClass('selection-selected');
      else
        $el.removeClass('selection-selected');
    }
    else    
      page('/item/' + this.props.item._id);
  },
  stopPropagation: function(e) {
    e.stopPropagation();      
  },
  getItemId : function() {
    return "it-" + this.props.item._id;
  },

  ///DRAG AND DROPPPPPPP
  componentDidMount: function() {      
    $( '#' + this.getItemId() ).draggable({
      //containment: ".listboard",
      revert: "invalid",
      drag: function() {
        //$(this).css({ position: 'fixed'});
      },
      zIndex: 3000
      //snap: ".listboard",
      //stack: ".main, .container, .listboard",
      //helper: 'clone'
      /*,
      helper: function( event ) {
        return $( "<div class='ui-widget-header'>I'm a custom helper</div>" );
      }*/
    });  
  },
  ///DRAG AND DROPPPPPPP



  render: function() {
    return (          
      <li ref='item' id={ this.getItemId() } ref="item"  onClick={ this.navigateToItem } className="item"> 
        <i className="icon-remove remove-item" title="Close"></i>
        <img className="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a onClick={ this.stopPropagation } className="title" target="_blank" href={this.props.item.url}>
          {  this.getTitle()  } 
        </a>
        <div className="description">{ this.props.item.note }</div>  		
        /*<div className="screenshot-container">
          <img className="screenshot" src={ this.getScreenshot() } alt="ScreenShot" />
        </div>  */        
      </li>
    );    
  }
});

module.exports = ItemComponent
