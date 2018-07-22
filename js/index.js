$(function () {
  var invoice = Invoice.init();
  $("#start").html("<a class='btn btn-lg btn-primary' href='./invoice.pug?invoice_id="+invoice.id+"'>New Invoice</a>");
});
