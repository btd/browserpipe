var item = require('./data/item'),
  Item = item.Item,
  Items = item.Items;

var model = require('moco').model;

var SearchIndex = require('./bloodhound/search-index');

var State1 = model()
  .attr('user')
  .attr('search', { default: '' })
  .attr('items', { type: Items, default: [] })
  .attr('tagIndex')
  .attr('selectedItem', { type: Item })
  .attr('showScreenshots', { default: false })
  .attr('isLoadingItems', { default: false })
  .attr('editorMode', { default: false })
  .attr('showBookmarkletModal', { default: false })
  .attr('config')
  .use(model.nestedObjects)
  .use(function (State) {
    State.on('initialize', function (state) {
      state.mixins = {};

      function capitalize(word) {
        return word[0].toUpperCase() + word.slice(1);
      }

      State1.keys.forEach(function (name) {
        var capName = capitalize(name);

        state.mixins[name] = {
          componentDidMount: function () {
            state.on('change:' + name, this['_on' + capName + 'Change']);
          },

          componentWillUnmount: function () {
            state.off('change:' + name, this['_on' + capName + 'Change']);
          }
        };

        state.mixins[name + 'ForceUpdate'] = {
          componentDidMount: function () {
            state.on('change:' + name, this['_on' + capName + 'Change']);
          },

          componentWillUnmount: function () {
            state.off('change:' + name, this['_on' + capName + 'Change']);
          }
        };

        state.mixins[name + 'ForceUpdate']['_on' + capName + 'Change'] = function () {
          this.forceUpdate();
        };

      });

    })
  });

var proto = {

  loadInitialData: function (initialOptions) {
    this.tagIndex = new SearchIndex({
      datumTokenizer: function(s) {
        s = typeof s === 'string' ? s: s._id;
        return s.split(/\W+/);
      },
      queryTokenizer: function(s) {
        return s.split(/\W+/);
      }
    });

    this.tagIndex.add(initialOptions.tags.map(function(t) { return t._id; }));

    //Load items
    this.loadItems(initialOptions.items || []);

    this.user = initialOptions.user;

    this.config = initialOptions.config;
  },

  //////////////////////////////////////////ITEMS//////////////////////////////////////
  //Load
  loadItems: function (from) {
    from.forEach(this.addItem, this);
  },

  size: function () {
    return this.items.reduce(function (acc, item) {
      return acc + item.size;
    }, 0);
  },

  //Gets
  getItemById: function (itemId) {
    return this.items.byId(itemId);
  },

  //CRUD
  addItem: function (item) {
    var _item = this.getItemById(item._id);
    if(!_item) {
      item = new Item(item);
      item.setSynced();

      this.items.push(item);
      return item;
    } else {
      return this.updateItem(item);
    }
  },

  updateItem: function (itemUpdate) {
    var item = this.getItemById(itemUpdate._id);
    if (item) {
      item.set(itemUpdate);
      item.setSynced();
    }
  },

  toggleEditorMode: function() {
    this.editorMode = !this.editorMode;
  }
};

for (var p in proto) {
  State1.prototype[p] = proto[p];
}

var state = new State1();

module.exports = state;
