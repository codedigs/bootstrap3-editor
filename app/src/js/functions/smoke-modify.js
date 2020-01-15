/**
 * Required library
 * - jquery
 * - smokejs
 */

window.smkAlert = function(smkOption) {
  var settings = $.extend({
    text: "Text content",
    position: "top-right",
    time: 2
  }, smkOption);

  $.smkAlert(settings);
};

window.smkConfirm = function(smkOption, callback) {
  var settings = $.extend({
    text: "Text content",
    accept: "Ok",
    cancel: "Cancel",
  }, smkOption);

  $.smkConfirm(settings, callback);
};
