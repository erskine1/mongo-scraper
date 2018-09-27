$(function() {

var tableBody = $("#tableBody")

if (tableBody.text().trim() === "") {
  console.log("it's empty");
  var tRow = $("<tr>");
  var tColSix = $(`<td colspan="6">`);
  tColSix.text("There's nothing here yet. Scrape the Path of Exile forum to populate this page!");
  tRow.append(tColSix);
  tableBody.append(tRow);
}

});