var App = (function() {
  var init = function() {
    var totalHeight = $(window).height();
    $('#playground').height(totalHeight - (15 * 2 + 2)); // less the margin top and bottom and border
    $('#add-layer').click(Layer.onAdd);

    $('#bs3-ed-layers .panel-title')
      .on("mouseenter", "a", Layer.onMouseIn)
      .on("mouseleave", "a", Layer.onMouseOut);

    $('#bs3-ed-layers .panel-title').on("click", "a", Layer.onSelect);
  };

  var Layer = {
    TRANSITION: 400,

    onAdd: function() {
      $(this).prop("disabled", true);

      $(this).animate({
        width: 24
      }, Layer.TRANSITION, function() {
        $(this).html('<span class="glyphicon glyphicon-plus"></span>');
        $(this).prop("disabled", false);
      });

      console.log('add layer');
    },

    onDeleteLayer: function() {

    },

    onSelect: function() {
      var _this = this;
      var iconEl = $("span", $(this));

      $('#bs3-ed-layers .panel-title a span').removeClass("active");

      _.delay(function() {
        if (!$(_this).hasClass("collapsed")) {
          iconEl.addClass("active");
        } else {
          iconEl.removeClass("active");
        }
      }, 100);
    },

    onMouseIn: function() {
      var iconEl = $("span", $(this));

      _.delay(function() {
        if (!iconEl.hasClass("collapsed")) {
          iconEl.addClass("hover");
        }
      }, 100);
    },

    onMouseOut: function() {
      var iconEl = $("span", $(this));

      _.delay(function() {
        if (!iconEl.hasClass("collapsed")) {
          iconEl.removeClass("hover");
        }
      }, 100);
    }
  };

  init();
})();

$(document).ready(App);
