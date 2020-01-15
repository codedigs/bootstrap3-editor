function Layer() {}

Layer.initialized = false;
Layer.TRANSITION = 400;

Layer.init = function(editorEl, layersEl) {
  if (!Layer.initialized) {
    Layer.initialized = true;
    Layer.editorEl = editorEl;
    Layer.layersEl = layersEl;

    $('.add-layer', Layer.editorEl).click(Layer.eventListeners.onAdd);

    Layer.layersEl
      .on("click", ".layer .delete-layer", Layer.eventListeners.onDelete)
      .on("click", ".layer .layer-btn", Layer.eventListeners.onSelect)
      .on("mouseenter", ".layer .layer-btn", Layer.eventListeners.onMouseIn)
      .on("mouseleave", ".layer .layer-btn", Layer.eventListeners.onMouseOut);

    var hasLayer = $('.layer', Layer.layersEl).length > 0;

    if (hasLayer) {
      $('.add-layer').tooltip({
        title: "Add Layer"
      });
    }

    $('.delete-layer[data-toggle="tooltip"]', Layer.layersEl).tooltip();
    $('.container-choices [data-toggle="tooltip"]', Layer.layersEl).tooltip();
  }
};

Layer.getCounter = function() {
  return $('#bs3-editor .panel-layers').data('counter');
};

Layer.incrementCounter = function() {
  var currentCounter = Layer.getCounter();
  $('#bs3-editor .panel-layers').data('counter', currentCounter+1);
};

Layer.eventListeners = {
  onAdd: function() {
    var _this = this;

    var before = function() {
      $(_this).prop("disabled", true);

      var hasLayer = $('.layer', Layer.layersEl).length > 0;

      if (hasLayer) {
        $(_this).prop("disabled", false);
        during();
      } else {
        $(_this).animate({ // animate the button
          width: 24
        }, Layer.TRANSITION, function() {
          $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
          $(_this).prop("disabled", false);
          $(_this).tooltip({
            title: "Add Layer"
          });

          during();
        });
      }

      // remove tooltip
      $(_this).tooltip("hide");
    };

    var during = function() {
      var tmpl = _.template($('#layer-tmpl').html());

      Layer.incrementCounter();
      Layer.layersEl.append(tmpl({
        layer_num: Layer.getCounter(),
        // layer_content: "Lorem ipsum"
      }));

      // initialize tooltip on new row
      $('.delete-layer:last[data-toggle="tooltip"]', Layer.layersEl).tooltip();
    };

    before();
  },

  onDelete: function() {
    var _this = this;

    var before = function() {
      $(_this).prop("disabled", true);

      var layer_name = $(_this).data("layer-name");

      smkConfirm({text: "Do you want to delete " + layer_name}, function(isYes) {
        $(_this).prop("disabled", false);

        if (isYes) {
          during();
        }
      });
    };

    var during = function() {
      $(_this).closest('.layer').fadeOut(function() {
        this.remove();

        after();
      });
    };

    var after = function() {
      var hasLayer = $('.layer', Layer.layersEl).length > 0;

      if (!hasLayer) {
        $('.add-layer', Layer.editorEl).prop("disabled", true);

        $('.add-layer', Layer.editorEl).animate({
          width: 82
        }, Layer.TRANSITION, function() {
          $('.add-layer', Layer.editorEl).html('<span class="glyphicon glyphicon-plus"></span> Add Layer');
          $('.add-layer', Layer.editorEl).prop("disabled", false);
          $('.add-layer', Layer.editorEl).tooltip("destroy");
        });
      }
    };

    before();
  },

  onSelect: function() {
    var _this = this;
    var iconEl = $("span", $(this));

    $('.layer .layer-btn span', Layer.layersEl).removeClass("active");

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

module.exports = Layer;
