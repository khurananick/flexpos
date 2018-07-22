$(function() {
  var name = $("#name");
  var type = $("#type");
  var fixed_fee = $("#fixed_fee");
  var percent_fee = $("#percent_fee");
  var percent_display = $("#percent_fee_display");
  var minimum_fee = $("#minimum_fee");

  $("#save").on("click", function () {
    if(!name.val() || (!fixed_fee.val() && !percent_fee.val() && !minimum_fee.val())) {
      alert("Oops... product requires name and one of either fixed fee or percent fee.");
      return;
    }

    Product.create({
      name: name.val(),
      type: type.val(),
      fixed_fee: fixed_fee.val(),
      percent_fee: percent_fee.val(),
      minimum_fee: minimum_fee.val()
    });

    alert("Saved!");
    document.location = "../html/index.pug";
  });
});
