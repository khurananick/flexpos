$(function() {
  var products_container = $("#products");
  var products = store.get("products");
  var productHtml = function(product) {
    var html = "";
    html +=  "<a href='./checkout.pug?product_id="+product.id+"' class='list-group-item'>";
    html +=    "<h3> ("+product.id+") "+product.name+"</h3>";
    //html +=    "<p>Fees: ";
    //if(product.fixed_fee)
    //  html +=    "[+$"+product.fixed_fee+"] ";
    //if(product.percent_fee)
    //  html +=    " [+"+product.percent_fee+"%]";
    //html +=    "</p>";
    html +=  "</a>";
    return html;
  };

  for(var key in products) {
    var product = products[key];
    products_container.append(productHtml(product));
  }
});
