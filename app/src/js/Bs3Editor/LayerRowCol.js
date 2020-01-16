function LayerRowCol() {}

LayerRowCol.initialized = false;
LayerRowCol.TRANSITION = 400;

LayerRowCol.init = function(pgEl, layersEl) {
  if (!LayerRowCol.initialized) {
    LayerRowCol.initialized = true;
    LayerRowCol.pgEl = pgEl;
    LayerRowCol.layersEl = layersEl;

    LayerRowCol.layersEl
      .on("click", ".add-layer-row-col", LayerRowCol.eventListeners.onAdd)
      .on("click", ".layer-row-col .delete-layer-row-col", LayerRowCol.eventListeners.onDelete)
      .on("click", ".layer-row-col .layer-row-col-btn", LayerRowCol.eventListeners.onSelect)
      .on("mouseenter", ".layer-row-col .layer-row-col-btn", LayerRowCol.eventListeners.onMouseIn)
      .on("mouseleave", ".layer-row-col .layer-row-col-btn", LayerRowCol.eventListeners.onMouseOut);

    // add tooltip in Add Row Button if the layer has rows
    var panelColEl = $('.layer .layer-row .layer-row-col:nth-child(1)', LayerRowCol.layersEl).parent();
    var addColBtn = panelColEl.parent().find('.add-layer-row-col');
    addColBtn.tooltip({
      title: "Add Col"
    });

    $('.delete-layer-row-col[data-toggle="tooltip"]', LayerRowCol.layersEl).tooltip();

    // disable hiding dropdown
    LayerRowCol.layersEl.on("click", ".layer-row-col .dropdown-menu", function(e) {
      e.stopPropagation();
    });
  }
};

LayerRowCol.getCounter = function(colsEl) {
  return colsEl.data('counter');
};

LayerRowCol.incrementCounter = function(colsEl) {
  var currentCounter = LayerRowCol.getCounter(colsEl);
  colsEl.data('counter', currentCounter+1);
};

LayerRowCol.eventListeners = {
  onAdd: function() {
    var _this = this;
    var tmp = {};
    var layerEl = $(this).closest('.layer');
    var layerRowEl = $(this).closest('.layer-row');
    var layer_num = layerEl.data('number');
    var row_num = layerRowEl.data('number');

    var colsEl = $('.panel-layers-rows-cols', layerRowEl);

    tmp.editor = {
      before: function() {
        $(_this).prop("disabled", true);

        var hasCol = $('.layer-row-col', colsEl).length > 0;

        if (hasCol) {
          $(_this).prop("disabled", false);
          tmp.editor.during();
        } else {
          $(_this).animate({
            width: 24
          }, LayerRowCol.TRANSITION, function() {
            $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
            $(_this).prop("disabled", false);
            $(_this).tooltip({
              title: "Add Col"
            });

            tmp.editor.during();
          });
        }

        // remove tooltip
        $(_this).tooltip("hide");
      },

      during: function() {
        var tmpl = _.template($('#layer-row-col-tmpl').html());

        LayerRowCol.incrementCounter(colsEl);
        colsEl.append(tmpl({
          layer_num: layer_num,
          row_num: row_num,
          col_num: LayerRowCol.getCounter(colsEl),
          // col_content: "Lorem ipsum"
        }));

        // initialize tooltip on new col
        $('.delete-layer-row-col:last[data-toggle="tooltip"]', colsEl).tooltip();

        // open new row
        $('.layer-row-col-btn:last', colsEl).click();

        tmp.playground();
      }
    };

    tmp.playground = function() {
      var tmpl = _.template($('#col-tmpl').html());
      var col_num = LayerRowCol.getCounter(colsEl);

      var pgLayerEl = $('.pg-layer[data-num="'+layer_num+'"]', LayerRowCol.pgEl);
      var pgRowEl = $('.pg-row[data-num="'+layer_num+'"]', pgLayerEl);
      pgRowEl.append(tmpl({
        num: col_num
      }));

      var pgColEl = $('.pg-col[data-num="'+col_num+'"]', pgRowEl);

      var gridInfoTmpl = _.template($('#grid-info-tmpl').html());
      pgColEl.prepend(gridInfoTmpl({
        block: "col",
        content: "Col " + col_num
      }));
    };

    tmp.editor.before();
  },

  onDelete: function() {
    var _this = this;

    var before = function() {
      $(_this).prop("disabled", true);

      var col_name = $(_this).data("col-name");

      smkConfirm({text: "Do you want to delete " + col_name}, function(isYes) {
        $(_this).prop("disabled", false);

        if (isYes) {
          during();
        }
      });
    };

    var during = function() {
      $(_this).closest('.layer-row-col').fadeOut(function() {
        // get layer-row element before delete it
        var layerRowEl = this.closest('.layer-row');
        this.remove();

        var colsEl = $('.panel-layers-rows-cols', layerRowEl);
        var hasNoCol = $('.layer-row-col', colsEl).length === 0;

        if (hasNoCol) {
          var addColBtnEl = colsEl.parent().find('.add-layer-row-col');

          addColBtnEl.prop("disabled", true);
          addColBtnEl.animate({
            width: 82
          }, LayerRowCol.TRANSITION, function() {
            addColBtnEl.html('<span class="glyphicon glyphicon-plus"></span> Add Col');
            addColBtnEl.prop("disabled", false);
            addColBtnEl.tooltip("destroy");
          });
        }
      });
    };

    before();
  },

  onSelect: function() {
    var _this = this;
    var iconEl = $("span", $(this));

    $('.layer-row-col .layer-row-col-btn span', LayerRowCol.layersEl).removeClass("active");

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

module.exports = LayerRowCol;
