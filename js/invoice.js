$(function() {
  var invoice_id = URLHelper.getGetParams.invoice_id;
  if(!invoice_id)
    document.location = "../html/index.pug";

  var invoice = Invoice.find_or_init(invoice_id);
  if(invoice.getChildren().length<1)
    document.location = "../html/index.pug";

  loadProducts(invoice);

  (function loadChildren() {
    var items = invoice.getChildren();
    var child_container = $("#existing");
    var childHtml = function(item, product) {
      var html = "";
      html +=  "<a href='' class='list-group-item'>";
      html +=    "<div class='row'>";
      html +=      "<div class='col-xs-6'>";
      html +=        "<p>"+product.attrs.name+"</p>";
      html +=      "</div>";
      html +=      "<div class='col-xs-6 text-right'>";
      if(product.attrs.type == "credit")
        html +=        "<p>$("+Num.asFloat(item.amount)+")</p>";
      else
        html +=        "<p>$"+Num.asFloat(item.amount)+"</p>";
      if(!product.attrs.fixed_price) {
        html +=        "<p>+$"+Num.asFloat(item.percent_total+item.fixed_total)+"</p>";
        if(product.attrs.type == "credit")
          html +=        "<p>Subtotal: $("+Math.abs(Num.asFloat(item.total_debit - item.total_credit))+")</p>";
        else
          html +=        "<p>Subtotal: $"+Math.abs(Num.asFloat(item.total_debit - item.total_credit))+"</p>";
      }
      html +=      "</div>";
      html +=    "</div>";
      html +=  "</a>";
      return html;
    };
    for(var key in items) {
      var item = items[key];
      var product = Product.find(item.product_id);
      child_container.append(childHtml(item, product));

      if(!invoice.attrs.total_debit) invoice.attrs.total_debit = 0;
      if(!invoice.attrs.total_credit) invoice.attrs.total_credit = 0;
      invoice.attrs.total_debit += parseFloat(item.total_debit);
      invoice.attrs.total_credit += parseFloat(item.total_credit);
    }

    var invoice_total = Num.asFloat(invoice.attrs.total_debit - invoice.attrs.total_credit);
    if(invoice_total < 0)
      $("#total").text("("+Math.abs(invoice_total)+")");
    else
      $("#total").text(Math.abs(invoice_total));
  })();

  (function printPrompt() {
    $("#finalize").on("click", function() {
      var win = window.open("../html/invoice_printable.pug?invoice_id="+invoice_id, "", "width=70,height=140");
      setTimeout(function() {
        document.location = "../html/index.pug";
      }, 1000);
    });
  })();
});
