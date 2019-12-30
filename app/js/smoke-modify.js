/**
 * Required library
 * - jquery
 * - smokejs
 */

function smkAlert(smkOption) {
  var settings = $.extend({
    text: "Text content",
    position: "top-right",
    time: 2
  }, smkOption);

  $.smkAlert(settings);
}

function smkConfirm(smkOption, callback) {
  var settings = $.extend({
    text: "Text content",
    accept: "Ok",
    cancel: "Cancel",
  }, smkOption);

  $.smkConfirm(settings, callback);
}
