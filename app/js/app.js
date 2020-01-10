var App = (function() {
  var setWindowHeight = function() {
    $('#playground').height($(window).height() - (15 * 2 + 2)); // less the margin top and bottom and border
  };

  setWindowHeight();
  $(window).resize(setWindowHeight);

  Bs3Editor();
});

$(document).ready(App);
