$(function() {
  var invoice_id = URLHelper.getGetParams.invoice_id;
  console.log(invoice_id);
  var product_id = URLHelper.getGetParams.product_id;
  var invoice = Invoice.find_or_init(invoice_id);
  console.log(invoice);
  var product = Product.find(product_id);

  (function loadCancelLink() {
    $("#cancel").html("<a href='../html/invoice.pug?invoice_id="+invoice_id+"'>Cancel And Return</a>");
  })();

  var amount  = $("#amount");
  var pct_fee = $("#percent_fee");
  var fxd_fee = $("#fixed_fee");
  var min_fee = $("#minimum_fee");
  var total_owed = $("#owed");
  var total_due  = $("#due");
  var finalize = $("#finalize");

  var percent_fee = 0;
  var percent_total = 0;
  var fixed_total = 0;
  var minimum_total = 0;
  var total_debit = 0;
  var total_credit = 0;

  var updateAmt = function(amount) {
    var amt = parseFloat(amount);
    var fee = 0;

    if(pct_fee.val()) {
      percent_fee = parseFloat(pct_fee.val()/100);
      percent_total = (amt * percent_fee);
      fee += percent_total;
    }

    if(fxd_fee.val()) {
      fixed_total = parseFloat(fxd_fee.val());
      fee += fixed_total;
    }

    if(min_fee.val()) {
      minimum_total = parseFloat(min_fee.val());
      if(minimum_total > fee)
        fee = minimum_total;
    }

    if(product.parent().type === "credit") {
      total_debit = amt + fee;
      total_due.text(total_debit);
    }
    else {
      total_credit = amt - fee;
      total_owed.text(total_credit);
    }
  };

  amount.on("keyup", function(e) {
    updateAmt(amount.val());
  });
  pct_fee.on("keyup", function(e) {
    updateAmt(amount.val());
  });
  fxd_fee.on("keyup", function(e) {
    updateAmt(amount.val());
  });
  finalize.on("click", function(e) {
    console.log(invoice);
    var item = {
      product_id: product_id,
      amount: amount.val(),
      percent_fee: percent_fee,
      percent_total: percent_total,
      fixed_total: fixed_total,
      total_debit: total_debit,
      total_credit: total_credit
    };
    console.log(item);
    console.log(invoice);
    invoice.addChild(item);
    console.log(invoice);
  });

  (function setDefaultValues() {
    $("#title").text(product.parent().name);
    pct_fee.val(product.parent().percent_fee||"0.00");
    fxd_fee.val(product.parent().fixed_fee||"0.00");
    min_fee.val(product.parent().minimum_fee||"0.00");
  })();
});
