$(function() {
  var invoice_id = URLHelper.getGetParams.invoice_id;
  if(!invoice_id)
    document.location = "../html/index.pug";
  var invoice = Invoice.find_or_init(invoice_id);

  (function loadHeader() {
    var settings = DB.get("settings");
    if(settings) {
      $("#header").text(settings.header);
      $("#footer").text(settings.footer);
    }
  })();

  (function loadChildren() {
    var items = invoice.getChildren();
    var child_container = $("#existing");
    var childHtml = function(item, product) {
      var html = "";
      html +=  "<tr>";
      html +=    "<td style='text-align:left;'>";
      html +=        "<b>"+product.attrs.name+"</b><br/>";
      if(!product.attrs.fixed_price)
        html +=        "<span>FEE($)</span><br/>";
      html +=    "</td>";
      html +=    "<td style='text-align:right;'>";
      if(product.attrs.type == "credit")
        html +=      "$("+Num.asFloat(item.amount)+")<br/>";
      else
        html +=      "$"+Num.asFloat(item.amount)+"<br/>";
      if(!product.attrs.fixed_price) {
        html +=        "+$"+Num.asFloat(item.percent_total+item.fixed_total)+"<br/>";
        //if(product.attrs.type == "credit")
        //  html +=      "<b>$("+Math.abs(Num.asFloat(item.total_debit - item.total_credit))+")</b><br/>";
        //else
        //  html +=      "<b>$"+Math.abs(Num.asFloat(item.total_debit - item.total_credit))+"</b><br/>";
      }
      html +=      "<hr>";
      html +=    "</td>";
      html +=  "</tr>";
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

      if((Number(key)+1) == items.length) {
        window.print();
        $(window).on("focus", function() {
          window.close();
        });
      }
    }

    var invoice_total = Num.asFloat(invoice.attrs.total_debit - invoice.attrs.total_credit);
    if(invoice_total < 0)
      $("#total").text("("+Math.abs(invoice_total)+")");
    else
      $("#total").text(Math.abs(invoice_total));
  })();
});
