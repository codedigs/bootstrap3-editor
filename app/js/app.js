var App = (function() {
  $('#playground').height($(window).height() - (15 * 2 + 2)); // less the margin top and bottom and border
  Bs3Editor();
});

$(document).ready(App);
