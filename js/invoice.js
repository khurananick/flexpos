$(function() {
  var invoice_id = URLHelper.getGetParams.invoice_id;
  if(!invoice_id)
    document.location = "../html/index.pug";

  var invoice = Invoice.find_or_init(invoice_id);
  if(invoice.getChildren().length<1)
    document.location = "../html/index.pug";

  var cash = $("#cash");
  var change = $("#change");
  var collected = parseFloat("0.00").toFixed(2);
  var due = parseFloat("0.00").toFixed(2);

  loadProducts(invoice);

  (function loadChildren() {
    var items = invoice.getChildren();
    var child_container = $("#existing");
    var childHtml = function(item, product) {
      var html = "";
      html +=  "<a href='' class='list-group-item' style='padding:0 5px;;'>";
      html +=    "<div class='row'>";
      html +=      "<div class='col-xs-6'>";
      html +=        "<p>"+product.attrs.name+"</p>";
      html +=      "</div>";
      html +=      "<div class='col-xs-6 text-right'>";
      if(product.attrs.type == "credit")
        html +=        "<span>$("+Num.asFloat(item.amount)+")</span><br/>";
      else
        html +=        "<span>$"+Num.asFloat(item.amount)+"</span><br/>";
      if(!product.attrs.fixed_price) {
        if(product.attrs.minimum_fee && product.attrs.minimum_fee > (item.percent_total+item.fixed_total))
          html +=        "<span>+$"+Num.asFloat(product.attrs.minimum_fee)+"</span><br/>";
        else
          html +=        "<span>+$"+Num.asFloat(item.percent_total+item.fixed_total)+"</span><br/>";
        if(product.attrs.type == "credit")
          html +=        "<p>Subtotal: $("+Math.abs(Num.asFloat(item.total_debit - item.total_credit)).toFixed(2)+")</p>";
        else
          html +=        "<p>Subtotal: $"+Math.abs(Num.asFloat(item.total_debit - item.total_credit)).toFixed(2)+"</p>";
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
  })();

  (function loadTotal() {
    var invoice_total = Num.asFloat(invoice.attrs.total_debit - invoice.attrs.total_credit);
    if(invoice_total < 0)
      $("#total").text("("+Math.abs(invoice_total).toFixed(2)+")");
    else
      $("#total").text(Math.abs(invoice_total).toFixed(2));


    if(invoice_total < 0) due = invoice_total;
    change.text(Math.abs(due));

    cash.on("keyup", function(e) {
      var collected = parseFloat(cash.val()||"0.00").toFixed(2);
      var due = (collected - parseFloat(invoice_total)).toFixed(2);
      if(due < 0) due = "0.00";
      change.text(Math.abs(due).toFixed(2));
    });
  })();

  (function printPrompt() {
    function doPrint() {
      invoice.attrs.cash = cash.val()||collected;
      invoice.attrs.change = change.text()||due;
      invoice.save();

      var win = window.open("../html/invoice_printable.pug?invoice_id="+invoice_id, "", "width=70,height=140");
      setTimeout(function() {
       $(window).on("focus", function() {
          document.location = "../html/index.pug";
       });
      }, 1000);
    }

    $win.on("keypress", function(e) { if(e.keyCode==112) doPrint(); });
    $("#finalize").on("click", function() { doPrint(); });
  })();
});
