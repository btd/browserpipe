var _state = require('../../../state'),
    _ = require('lodash'),
    React = require('react'),
    cx = React.addons.classSet;

var ENTER = 13;

var InlineEditor = React.createClass({
    propTypes: {
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        value: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        focus: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            valid: true,
            value: this.props.value || ''
        };
    },

    save: function() {
        this.state.valid && this.props.onSave(this.getValue());
    },

    checkValid: function(value) {
        var valid = this.isValid(value);
        this.setState({ valid: valid });
        return valid;
    },

    isValid: function(value) {
        return value.length > 0;
    },

    getValue: function() {
        return this.state.value.trim();
    },

    setValue: function(evt) {
        var value = (evt.target.value || '');
        this.checkValid(value.trim());
        this.setState({ value: value });
    },

    cancel: function() {
        this.props.onCancel();
    },

    ifEnterSave: function(e) {
        if(e.keyCode === ENTER) this.save();
    },

    componentDidMount: function(){
        this.refs.input.getDOMNode().focus();
    },

    baseClassName: function() {
        return cx({
            'inline-editor': true,
            'input-append': true,
            'control-group': true,
            error: !this.state.valid
        });
    },

    render: function() {
        return <div className={this.baseClassName()}>
                    <input ref="input" type="text" value={this.state.value} placeholder={this.props.placeholder} onChange={this.setValue} onKeyPress={this.ifEnterSave} />
                    <button onClick={this.save} className="btn save" type="button"><i className="icon-check"></i></button>
                    <button onClick={this.cancel} className="btn cancel" type="button"><i className="icon-times"></i></button>
                </div>
    }
});

var ContainerItem = React.createClass({
    render: function() {
        var item = this.props.item;
        return  <div className="item item-container" title="Click to open" onClick={this.props.onClickContainer} >
                       <i className="icon-folder item-icon icon-2x"></i>
                       { this.props.children ?
                           this.props.children :
                            <span>
                               <span className="item-title">{ item.title }</span>
                            </span>
                         }
                   </div>
    }
});

function absUrl(url) {
    if(url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0) return url;
    return url[0] === '/' ? url : '/' + url;
}

var BookmarkItem = React.createClass({
    icon: function() {
        var item = this.props.item;
        if(item && item.favicon) {
            return <img className="item-favicon item-icon" src={absUrl(item.favicon)} alt="favicon"/>
        } else {
            return <i className="icon-bookmark item-icon icon-2x"></i>
        }
    },

    render: function() {
        var item = this.props.item;
        return <div className="item item-bookmark" >
                          { this.icon() }
                          { this.props.children ?
                            this.props.children :
                             <span>
                                <span className="item-title">{ item.title }</span>
                                <a className="item-url" href={ item.url } target="_blank">{ item.url }</a>
                             </span>
                          }
                    </div>

    }
});

var config = initialOptions.config;
function saveToThisBookmarklet(item) {
    return "javascript:if(document.getSelection){s=document.getSelection();}else{s='';};document.location='"+config.appUrl+"/add?next=same&url='+encodeURIComponent(location.href)+'&description='+encodeURIComponent(s)+'&title='+encodeURIComponent(document.title)+'&to="+item._id+"'";
}

var minWidthToColumns = [ //copy from less
    310,
    615,
    920,
    1225,
    1530,
    1835
];

function getColumnsCount(width) {
    var l = minWidthToColumns.length;
    while(l-- && minWidthToColumns[l] > width);
    return l + 1;
}

function zeroArray(size) {
    var arr = new Array(size);
    while(size--) arr[size] = 0;
    return arr;
}

var OnResizeMixin = {
    componentDidMount: function(rootNode) {
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    }
}

var ItemsPanel = React.createClass({
    mixins: [ OnResizeMixin ],

    getInitialState: function(){
        return {
            addingItem: false,
            editTitle: false,
            columnsCount: this.columnsCount()
        }
    },

    columnsCount: function() {
        return getColumnsCount(window.innerWidth);
    },

    recalculateItemsPositions: function() {
        var container = this.refs.itemsContainer.getDOMNode();
        var columnsCount = getColumnsCount(container.clientWidth);
        var items = container.querySelectorAll('.item-wrapper');

        this.columnsCount = columnsCount;

        var pos = zeroArray(columnsCount);

        for(var i = 0, length = items.length; i < length; i++) {
            var row = Math.ceil(i / columnsCount);
            var col = Math.ceil(i % columnsCount);
            var item = items[i];

            var topMargin = parseInt(item.style.marginTop || '0px', 10);
            if(pos[col] != item.offsetTop) {
                item.style.marginTop = '' + (pos[col] - item.offsetTop + topMargin) + 'px';
            }

            pos[col] = pos[col] + item.clientHeight;
        }
    },

    handleResize: function() {
        //if(this.columnsCount) { // already was initial calculation
            //var container = this.refs.itemsContainer.getDOMNode();
            //var columnsCount = getColumnsCount(container.clientWidth);
            //if(this.columnsCount != columnsCount)
            //    this.recalculateItemsPositions();
        //}
        var c = this.columnsCount();
        if(this.state.columnsCount !== c) this.setState({ columnsCount: c });
    },

    componentDidMount: function(rootNode) {
        //this.recalculateItemsPositions();
    },

    getClassName: function() {
        return cx({
            'listboard-panel': true,
            'panel': true,
            'half' : !this.props.wide
        });
    },

    getSubBarClassName: function() {
        return cx({
            navbar: true,
            'sub-bar': true,
            border: this.props.active
        });
    },

    getIcon: function() {
        var obj = this.props.obj;
        return obj.typeName === 'listboard' && obj.type === 0 ?
            <img className="listboard-icon" draggable="false" src="/img/common/chrome-logo.png" alt="Chrome Logo" />
                : null;
    },

    getSubTitle: function() {
        if(this.props.obj.type === 0)
          return <span className="sub-title">browser - last sync 2 min ago</span>
        else
          return <span className="sub-title"></span>
    },

    renderTitle: function() {
        if(this.state.editTitle) {
            return <InlineEditor onSave={this.saveTitle} value={this.props.obj.title} placeholder="Type Name" onCancel={this.cancelSaveTitle} />
        } else if(this.props.obj.title) {
            return <span onClick={this.editTitle}>{this.props.obj.title}</span>
        } else {
            return <span onClick={this.editTitle}><i>Unnamed</i></span>
        }
    },

    editTitle: function() {
        this.setState({ editTitle: true });
    },

    saveTitle: function(title) {
        this.props.obj.title = title;
        _state.serverUpdateItem(this.props.obj);
        this.setState({ editTitle: false });
    },

    cancelSaveTitle: function() {
        this.setState({ editTitle: false });
    },

    renderItem: function(item) {
        switch(item.type) {
            case 0: return <BookmarkItem key={item._id} item={item} />;
            case 1:
            case 2: return <ContainerItem key={item._id} item={item} onClickContainer={this.navigateItem.bind(this, item)} />;
        }
    },

    renderItemEditor: function() {
        switch(this.state.addingItemType) {
            case 0: return <BookmarkItem><InlineEditor onSave={this.addItem} placeholder="Type Url" onCancel={this.cancelAddItem} /></BookmarkItem>;
            case 1:
            case 2: return <ContainerItem><InlineEditor onSave={this.addItem} placeholder="Type Name" onCancel={this.cancelAddItem} /></ContainerItem>;
        }
    },

    showAddItem: function(item) {
        this.setState({ addingItem: true, addingItemType: item.type })
    },

    addItem: function(name) {
        var item = { type: this.state.addingItemType, parent: this.props.obj._id };
        if(this.state.addingItemType === 0) item.url = name;
        else item.title = name;

        _state.serverAddItemToItem(this.props.obj._id, item);
        this.setState({ addingItem: false, addingItemType: null });
    },

    cancelAddItem: function() {
        this.setState({ addingItem: false, addingItemType: null });
    },

    deleteObj: function() {
        var obj = this.props.obj;
        this.navigateTop();
        _state.serverDeleteItem(obj);
    },

    navigateItem: function(item) {
        _state.setSelected(this.props.num, item);
    },

    navigateTop: function() {
        var item = _state.getItemById(this.props.obj.parent);
        this.navigateItem(item);
    },

    render: function() {
        var columns = [];
        var c = this.state.columnsCount;
        while(c--) columns.push([]);
        this.props.obj.items.forEach(function(item, idx) {
            columns[idx % this.state.columnsCount].push(item);
        }, this);

        if(this.state.addingItem) {
            columns[this.props.obj.items.length % this.state.columnsCount].push({ editor: true});
        }

        return (
            <div className={ this.getClassName() } >
              <div className={ this.getSubBarClassName() } >
                <div className="navbar-inner" >
                  {
                      this.props.obj.parent &&
                          <ul className="nav pull-right">
                            <li className="dropdown">
                              <a href="#" title="Settings" className="dropdown-toggle" data-toggle="dropdown">
                                <i className="icon-cog"></i>
                              </a>
                              <ul className="dropdown-menu">
                                <li><a onClick={this.deleteObj} href="javascript:void(0)">Delete</a></li>
                              </ul>
                            </li>
                          </ul>
                  }
                  <ul className="nav pull-left">
                    <li className="title">
                      { this.getIcon() }
                      { this.renderTitle() }
                    </li>
                    {
                        this.props.obj.parent &&
                            <li className="btn" onClick={this.navigateTop} title="Go upper"><i className="icon-level-up"></i></li>
                    }
                    <li className="btn" onClick={this.showAddItem.bind(this, { type: 2 })}>
                        <i className="icon-plus icon-fw"></i><i className="icon-folder icon-fw"></i>
                    </li>
                    <li className="btn" onClick={this.showAddItem.bind(this, { type: 0 })}>
                        <i className="icon-plus icon-fw"></i><i className="icon-bookmark icon-fw"></i>
                    </li>
                    <li className="bookmarklet">
                        <a href={saveToThisBookmarklet(this.props.obj)}>{ "Save to " + this.props.obj.title }</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="panel-center">
                <div ref="itemsContainer" className="items-container">
                {
                    columns.map(function(column, idx) {
                        return <div className="items-column" key={idx}>{
                                column.map(function(itemId) {
                                    if(!itemId.editor) {
                                        var item = _state.getItemById(itemId);
                                        return this.renderItem(item);
                                    } else {
                                        return this.renderItemEditor();
                                    }
                                }, this)
                               }</div>
                    }, this)
                }
                </div>
              </div>
            </div>
        );
    }
})

module.exports = ItemsPanel;