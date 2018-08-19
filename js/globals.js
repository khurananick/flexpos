// load storage
var Store  = require('electron-store');
window.DB = new Store();
var CrudModel = function(table) {
  var item, index;
  var Item = {
    all: function() {
      var items = DB.get(table)||{};
      for(var key in items) {
        if(items[key].is_deleted) delete(items[key]);
      }
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
      instance = Item.find(id);
      if(instance) return instance;
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
        id: item.id,
        attrs: item,
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
          if(item)
            return item.children;
          else
            return Self.attrs.children;
        },
        save: function() {
          var items = Item.all(table);
          items[item.id] = item;
          DB.set(table, items);
        },
        destroy: function() {
          item.is_deleted = true;
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

// Number helpers.
window.Num = {
  asFloat: function(input) {
    return parseFloat(parseFloat(input).toFixed(2)).toFixed(2);
  }
};

// Global Listeners
window.$win = $(window);
$(function() {
  let electron = require("electron");
  $win.on("keypress", function(e) {
    if(e.keyCode == 32 && event.shiftKey) {
      electron.remote.getCurrentWindow().toggleDevTools();
    } else if(e.keyCode==113) {
      document.location = "../html/index.pug";
    } else {
      if(!e.key.match(/[a-zA-Z]/)) return;
      var href = $("#product"+e.key).attr("href");
      if(href) document.location = href;
    }
  });
});

var loadProducts = function(invoice) {
  var products = Product.all();
  var new_container = $("#new");
  var productHtml = function(product) {
    var tkey = (product.trigger_key||product.id);
    var html = "";
    html +=  "<a id='product"+tkey+"' href='./add_item.pug?invoice_id="+invoice.id+"&product_id="+product.id+"' class='list-group-item'>";
    html +=    "<p> ("+tkey+") "+product.name+"</p>";
    html +=  "</a>";
    return html;
  };
  for(var key in products) {
    var product = products[key];
    new_container.append(productHtml(product));
  }
};
