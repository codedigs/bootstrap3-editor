function LayerRow() {}

LayerRow.initialized = false;
LayerRow.TRANSITION = 400;

LayerRow.init = function(layersEl) {
  if (!LayerRow.initialized) {
    LayerRow.initialized = true;
    LayerRow.layersEl = layersEl;

    LayerRow.layersEl
      .on("click", ".add-layer-row", LayerRow.eventListeners.onAdd)
      .on("click", ".layer-row .delete-layer-row", LayerRow.eventListeners.onDelete)
      .on("click", ".layer-row .layer-row-btn", LayerRow.eventListeners.onSelect)
      .on("mouseenter", ".layer-row .layer-row-btn", LayerRow.eventListeners.onMouseIn)
      .on("mouseleave", ".layer-row .layer-row-btn", LayerRow.eventListeners.onMouseOut);

    // add tooltip in Add Row Button if the layer has rows
    var panelRowEl = $('.layer .layer-row:nth-child(1)', LayerRow.layersEl).parent();
    var addRowBtn = panelRowEl.parent().find('.add-layer-row');
    addRowBtn.tooltip({
      title: "Add Row"
    });

    $('.delete-layer-row[data-toggle="tooltip"]', LayerRow.layersEl).tooltip();
    $('.gutter-choices [data-toggle="tooltip"]', LayerRow.layersEl).tooltip();
  }
};

LayerRow.getCounter = function(rowsEl) {
  return rowsEl.data('counter');
};

LayerRow.incrementCounter = function(rowsEl) {
  var currentCounter = LayerRow.getCounter(rowsEl);
  rowsEl.data('counter', currentCounter+1);
};

LayerRow.eventListeners = {
  onAdd: function() {
    var _this = this;
    var tmp = {};
    var layerEl = $(this).closest('.layer');
    var layer_num = layerEl.data('layer-number');
    var rowsEl = $('.panel-layers-rows', layerEl);

    tmp.editor = {
      before: function() {
        $(_this).prop("disabled", true);

        var hasRow = $('.layer-row', rowsEl).length > 0;

        if (hasRow) {
          $(_this).prop("disabled", false);
          tmp.editor.during();
        } else {
          $(_this).animate({
            width: 24
          }, LayerRow.TRANSITION, function() {
            $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
            $(_this).prop("disabled", false);
            $(_this).tooltip({
              title: "Add Row"
            });

            tmp.editor.during();
          });
        }

        // remove tooltip
        $(_this).tooltip("hide");
      },

      during: function() {
        var tmpl = _.template($('#layer-row-tmpl').html());

        LayerRow.incrementCounter(rowsEl);
        rowsEl.append(tmpl({
          layer_num: layer_num,
          row_num: LayerRow.getCounter(rowsEl),
          // row_content: "Lorem ipsum"
        }));

        // initialize tooltip on new row
        $('.delete-layer-row:last[data-toggle="tooltip"]', rowsEl).tooltip();

        tmp.playground();
      }
    };

    tmp.playground = function() {
      var tmpl = _.template($('#row-tmpl').html());
      var row_num = LayerRow.getCounter(rowsEl);

      var pgLayerEl = $('.pg-layer[data-num="'+layer_num+'"]', LayerRow.pgEl);
      pgLayerEl.append(tmpl({
        num: row_num
      }));

      var pgRowEl = $('.pg-row[data-num="'+row_num+'"]', pgLayerEl);

      var gridInfoTmpl = _.template($('#grid-info-tmpl').html());
      pgRowEl.prepend(gridInfoTmpl({
        block: "row",
        content: "Row " + row_num
      }));
    };

    tmp.editor.before();
  },

  onDelete: function() {
    var _this = this;

    var before = function() {
      $(_this).prop("disabled", true);

      var row_name = $(_this).data("row-name");

      smkConfirm({text: "Do you want to delete " + row_name}, function(isYes) {
        $(_this).prop("disabled", false);

        if (isYes) {
          during();
        }
      });
    };

    var during = function() {
      $(_this).closest('.layer-row').fadeOut(function() {
        // get layer element before delete it
        var layerEl = this.closest('.layer');
        this.remove();

        var rowsEl = $('.panel-layers-rows', layerEl);
        var hasNoRow = $('.layer-row', rowsEl).length === 0;

        if (hasNoRow) {
          var addRowBtnEl = rowsEl.parent().find('.add-layer-row');

          addRowBtnEl.prop("disabled", true);
          addRowBtnEl.animate({
            width: 82
          }, LayerRow.TRANSITION, function() {
            addRowBtnEl.html('<span class="glyphicon glyphicon-plus"></span> Add Row');
            addRowBtnEl.prop("disabled", false);
            addRowBtnEl.tooltip("destroy");
          });
        }
      });
    };

    before();
  },

  onSelect: function() {
    var _this = this;
    var iconEl = $("span", $(this));

    $('.layer-row .layer-row-btn span', LayerRow.layersEl).removeClass("active");

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

module.exports = LayerRow;
