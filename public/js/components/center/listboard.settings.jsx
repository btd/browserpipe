/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    LabelEditorComponent = require('../util/label.editor');

var ListboardSettingsComponent = React.createClass({
    getListboardSettingsStyle: function() {
        var visible = this.props.visible? "block" : "none";
        return { display: visible };
    },
    saveListboardLabel: function(newLabel, success) {    
        _state.serverUpdateListboard({
            _id: this.props.selectedListboard._id,
            label: newLabel
        }, success );
    },
    goToHome: function(e) {
        page('/listboard/' + this.props.selectedListboard._id);
        e.preventDefault();
    },
    showDeleteWarning: function() {      
        this.refs.deleteOption.getDOMNode().className = "delete-option hide";
        this.refs.deleteWarning.getDOMNode().className = "alert alert-error";            
    },
    hideDeleteWarning: function() {
        this.refs.deleteOption.getDOMNode().className = "delete-option";
        this.refs.deleteWarning.getDOMNode().className = "alert alert-error hide";
    },
    deleteListboard: function() {    
        var that = this;
        _state.serverRemoveListboard(this.props.selectedListboard, function() {
            that.hideDeleteWarning();
            page('/listboards');
        });
    },
    render: function() {        
        var self = this;
        return  (
            <div className="listboard-settings" style={ this.getListboardSettingsStyle() }>                                             
                <a draggable="false"  onClick={this.goToHome} className="back-icon" href="#">
                    <i className="icon-arrow-left">&nbsp;&nbsp;go back</i>
                </a>
                <div className="name-editor">             
                    <LabelEditorComponent 
                        onSaveLabel= {this.saveListboardLabel} 
                        labelValue= {this.props.selectedListboard.label} />
                    <small><i>(click to edit)</i></small>
                </div>
                <a draggable="false"  ref="deleteOption" onClick={this.showDeleteWarning} href="#" className="delete-option">delete listboard</a>
                <div ref="deleteWarning" className="alert alert-error hide">
                    <div>All data from this listboard that was not archived in folders will be deleted.</div>
                    <div>Do you want to continue?</div>
                    <button onClick={this.deleteListboard} className="save-option btn btn-danger btn-small" type="button">Yes, delete it</button>
                    <span onClick={this.hideDeleteWarning} className="cancel-option">no, cancel</span>
                </div>
        </div>);
    }
});

module.exports = ListboardSettingsComponent