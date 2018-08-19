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

  (function loadDateAndID() {
    var d = new Date();
    $("#date").text(d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "  " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
    $("#invoice_id").text(invoice_id);
  })();

  (function loadChildren() {
    var items = invoice.getChildren();
    var child_container = $("#existing");
    var childHtml = function(item, product) {
      var html = "";
      html +=  "<tr>";
      html +=    "<td style='text-align:left;padding-top:10px;'>";
      html +=        "<span>"+product.attrs.name+"</span><br/>";
      if(!product.attrs.fixed_price)
        html +=        "<span>FEE($)</span><br/>";
      html +=    "</td>";
      html +=    "<td style='text-align:right;padding-top:10px;'>";
      if(product.attrs.type == "credit")
        html +=      "$("+Num.asFloat(item.amount)+")<br/>";
      else
        html +=      "$"+Num.asFloat(item.amount)+"<br/>";
      if(!product.attrs.fixed_price) {
        if(product.attrs.minimum_fee && product.attrs.minimum_fee > (item.percent_total+item.fixed_total))
          html +=        "+$"+Num.asFloat(product.attrs.minimum_fee)+"<br/>";
        else
          html +=        "+$"+Num.asFloat(item.percent_total+item.fixed_total)+"<br/>";
      }
      html +=    "</td>";
      html +=  "</tr>";
      return html;
    };
    for(var key in items) {
      var item = items[key];
      var product = Product.find(item.product_id);
      child_container.append(childHtml(item, product));

      if((Number(key)+1) == items.length) {
        window.print();
        setTimeout(function () { window.close(); }, 2000);
      }
    }

    var invoice_total = Num.asFloat(invoice.attrs.total_debit - invoice.attrs.total_credit);
    if(invoice_total < 0)
      $("#total").text("("+Math.abs(invoice_total).toFixed(2)+")");
    else
      $("#total").text(Math.abs(invoice_total).toFixed(2));

    $("#cash").text(parseFloat(invoice.attrs.cash).toFixed(2));
    $("#change").text(parseFloat(invoice.attrs.change).toFixed(2));
  })();
});
