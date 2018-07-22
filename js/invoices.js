$(function() {
  var invoices_container = $("#invoices");
  var invoices = store.get("invoices");
  var products = store.get("products");
  var invoiceHtml = function(invoice) {
    var html = "";
    html += "<div class='list-group-item'>";
    html +=   "<h3>"+products[invoice.product_id-1].name+"</h3>";
    html +=   "<p>$"+invoice.total+"</p>";
    html += "</div>";
    return html;
  };
  (function loadInvoices() {
    for (var i = invoices.length; i > 0; --i) {
      var invoice = invoices[i-1];
      invoices_container.append(invoiceHtml(invoice));
    }
  })();
});
