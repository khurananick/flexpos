// load storage
var Store  = require('electron-store');
window.DB = new Store();
var CrudModel = function(table) {
  var item, index;
  var Item = {
    all: function() {
      var items = DB.get(table)||{};
      return items;
    },
    create: function(params={}) {
      var items = Item.all();
      index = (Item.max_id(items)+1);
      item = Object.assign({ id: index, children: [] }, params);
      items[item.id] = item;
      DB.set(table, items);
      return Item.instance();
    },
    find: function(id) {
      var items = Item.all();
      index = id;
      item = items[id];
      if(!item || item.id != id)
        for(var key in items)
          if(items[key].id == id)
            item = items[key];
      if(!item) return null;
      return Item.instance();
    },
    find_or_init: function(id) {
      index = id;
      item = Item.find(id);
      if(item) return item;
      return Item.init({id: id});
    },
    init: function(params={}) {
      var items = Item.all();
      index = (Item.max_id(items)+1);
      item = Object.assign({ id: index, children: [] }, params);
      return Item.instance();
    },
    instance: function() {
      var Instance = {
        parent: function() {
          return item;
        },
        addChild: function(child) {
          item.children.push(child);
          Instance.save();
        },
        removeChild: function(child_index) {
          Instance.save();
        },
        getChild: function(child_index) {
          return item.children[child_index];
        },
        getChildren: function() {
          return item.children[child_index];
        },
        save: function() {
          var items = Item.all(table);
          items[item.id] = item;
          DB.set(table, items);
        }
      };
      return Instance;
    },
    max_id: function(obj) {
      var max_num = 0;
      for(var key in obj) {
        var id = Number(key);
        if(max_num < id) max_num = id;
      }
      return max_num;
    }
  };
  return Item;
};
window.Product = CrudModel("products");
window.Invoice = CrudModel("invoices");

// URL helpers.
window.URLHelper = {
  getGetParams: (function() {
    var query = window.location.search.substring(1);
    var raw_vars = query.split("&");
    var params = {};
    for(var key in raw_vars) {
      param = raw_vars[key].split("=");
      variable = param[0];
      value = param[1];
      if(variable) {
        params[variable] = decodeURIComponent(value);
      }
    }
    return params;
  })(),
  compileGetParams: function(obj) {
    var str = "";
    for(var key in obj) {
      if(str !== "")
        str += "&";
      str += key + "=" + obj[key];
    }
    return document.location.origin + document.location.pathname + "?" + str;
  }
};
