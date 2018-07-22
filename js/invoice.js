$(function() {
  var invoice_id = URLHelper.getGetParams.invoice_id;
  if(!invoice_id)
    document.location = "../html/index.pug";
  var invoice = Invoice.find_or_init(invoice_id);

  (function loadProducts() {
    var products = Product.all();
    var new_container = $("#new");
    var productHtml = function(product) {
      var html = "";
      html +=  "<a href='./add_item.pug?invoice_id="+invoice_id+"&product_id="+product.id+"' class='list-group-item'>";
      html +=    "<p> ("+product.id+") "+product.name+"</p>";
      html +=  "</a>";
      return html;
    };
    for(var key in products) {
      var product = products[key];
      new_container.append(productHtml(product));
    }
  })();
});
