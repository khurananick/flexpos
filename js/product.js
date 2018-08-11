$(function() {
  var name = $("#name");
  var type = $("#type");
  var fixed_price = $("#fixed_price");
  var fixed_fee = $("#fixed_fee");
  var percent_fee = $("#percent_fee");
  var percent_display = $("#percent_fee_display");
  var minimum_fee = $("#minimum_fee");
  var trigger_key = $("#trigger_key");

  $("#save").on("click", function () {
    if(!name.val() || (!fixed_price.val() && !fixed_fee.val() && !percent_fee.val() && !minimum_fee.val())) {
      alert("Oops... product requires name and one of either fixed fee or percent fee.");
      return;
    }

    Product.create({
      name: name.val(),
      type: type.val(),
      fixed_price: fixed_price.val(),
      fixed_fee: fixed_fee.val(),
      percent_fee: percent_fee.val(),
      minimum_fee: minimum_fee.val(),
      trigger_key: (trigger_key.val() ? trigger_key.val().toLowerCase() : null)
    });

    alert("Saved!");
    document.location = "../html/index.pug";
  });
});
