$(function() {
  var header = $("#header");

  $("#save").on("click", function () {
    if(!header.val()) {
      alert("Oops... header seems to be blank.");
      return;
    }
    store.set("header", header.val());
    alert("Saved!");
  });

  header.text(store.get("header"));
});
