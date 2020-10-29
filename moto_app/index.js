// $(".angle").css("transform", "rotate(90deg)");

// function getUpdate() {
var thita = null;
url = "http://localhost:8089/";
//jquery get angle

$.get(url, function (data) {
  var d = {
    slat: parseInt(data.slat),
    slng: parseInt(data.slng),
    elat: parseInt(data.elat),
    elng: parseInt(data.elng),
  };
  window.thita = Math.tan((d.elng - d.slng) / (d.elat - d.slat));
});
//compute angle
var angle = (thita * 180) / Math.PI;
$(".angle").css("transform", "rotate(" + angle + "deg)");
// }

// while (window.thita === null || window.thita != 0) {
//   getUpdate();
// }
