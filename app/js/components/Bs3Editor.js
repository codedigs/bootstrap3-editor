var Bs3Editor;
(function() {
  // singleton
  var instanstiated = false;
  Bs3Editor = function() {
    if (instanstiated) { return false; }
    instanstiated = true;

    var editorEl = $('#bs3-editor');
    var layersEl = $('#bs3-ed-layers');

    var init = function() {
      $(':input[name="overlay"]', editorEl).click(Overlay.onClick);
      Layer.init();
      LayerRow.init();
      LayerRowCol.init();
    };

    var DragEvent = {
      initialCursorCoor: {
        x: 0, y: 0
      },
      initialEditorCoor: {
        x: 0, y: 0
      },
      readyToDrag: false,

      onReadyToDrag: function(e) {
        var moveTooloffset = $('.panel-heading .move-tool', editorEl).offset();
        var moveToolWidth = $('.panel-heading .move-tool', editorEl).width();
        var moveToolHeight = $('.panel-heading .move-tool', editorEl).height();

        var moveToolPos = {
            pt: {
              x: moveTooloffset.left,
              y: moveTooloffset.top
            },
            w: moveToolWidth,
            h: moveToolHeight
        };

        var cursorPos = {
          pt: {
            x: e.pageX,
            y: e.pageY
          },
          w: 15,
          h: 15
        };

        if (is_collided(moveToolPos, cursorPos)) {
          DragEvent.readyToDrag = true;
          DragEvent.initialCursorCoor = {
            x: e.pageX,
            y: e.pageY
          };

          var offset = editorEl.offset();
          DragEvent.initialEditorCoor = {
            x: offset.left,
            y: offset.top
          };
        }
      },

      onDragging: function(e) {
        if (DragEvent.readyToDrag) {
          var top = e.pageY - DragEvent.initialCursorCoor.y;
          var left = e.pageX - DragEvent.initialCursorCoor.x;

          editorEl.css({
            top: DragEvent.initialEditorCoor.y + top,
            left: DragEvent.initialEditorCoor.x + left
          });
        }
      },

      onStopToDrag: function() {
        DragEvent.readyToDrag = false;
      }
    };

    var Overlay = {
      onClick: function() {
        var is_overlay = $(this).is(":checked");

        if (is_overlay) {
          $('#playground').parent().removeClass("col-xs-8").addClass("col-xs-12");

          editorEl.addClass("overlay")
            .parent()
            .parent().removeClass("col-xs-4");

          $('.panel-heading .move-tool', editorEl)
            .mousedown(DragEvent.onReadyToDrag)
            .mousemove(DragEvent.onDragging)
            .on("mouseup mouseleave", DragEvent.onStopToDrag);

          $('.panel-heading .move-tool', editorEl).show();

          var OFFSET = 15;

          editorEl.css({
            top: OFFSET + 31, // 31 for move tool icon
            left: OFFSET
          });
        } else {
          $('#playground').parent().removeClass("col-xs-12").addClass("col-xs-8");

          editorEl.removeClass("overlay")
            .parent()
            .parent().addClass("col-xs-4");

          $('.panel-heading .move-tool', editorEl).off("mousedown", DragEvent.onReadyToDrag)
            .off("mousemove", DragEvent.onDragging)
            .off("mouseup mouseleave", DragEvent.onStopToDrag);

          $('.panel-heading .move-tool', editorEl).hide();
        }
      }
    };

    var Layer = {
      TRANSITION: 400,

      getCounter: function() {
        return $('#bs3-editor .panel-layers').data('counter');
      },

      incrementCounter: function() {
        var currentCounter = Layer.getCounter();
        $('#bs3-editor .panel-layers').data('counter', currentCounter+1);
      },

      init: function() {
        $('.add-layer', editorEl).click(Layer.onAdd);

        layersEl
          .on("click", ".layer .delete-layer", Layer.onDelete)
          .on("click", ".layer .layer-btn", Layer.onSelect)
          .on("mouseenter", ".layer .layer-btn", Layer.onMouseIn)
          .on("mouseleave", ".layer .layer-btn", Layer.onMouseOut);

        var hasLayer = $('.layer', layersEl).length > 0;

        if (hasLayer) {
          $('.add-layer').tooltip({
            placement: "right",
            title: "Add Layer"
          });
        }

        $('.container-choices [data-toggle="tooltip"]', layersEl).tooltip();
      },

      onAdd: function() {
        var _this = this;

        var before = function() {
          $(_this).prop("disabled", true);

          var hasLayer = $('.layer', layersEl).length > 0;

          if (hasLayer) {
            during();
            $(_this).prop("disabled", false);
          } else {
            $(_this).animate({ // animate the button
              width: 24
            }, Layer.TRANSITION, function() {
              $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
              $(_this).prop("disabled", false);
              $(_this).tooltip({
                placement: "right",
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
          layersEl.append(tmpl({
            layer_number: Layer.getCounter(),
            layer_name: "Layer " + Layer.getCounter(),
            layer_content: "Lorem ipsum"
          }));
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
          var hasLayer = $('.layer', layersEl).length > 0;

          if (!hasLayer) {
            $('.add-layer', editorEl).prop("disabled", true);

            $('.add-layer', editorEl).animate({
              width: 82
            }, Layer.TRANSITION, function() {
              $('.add-layer', editorEl).html('<span class="glyphicon glyphicon-plus"></span> Add Layer');
              $('.add-layer', editorEl).prop("disabled", false);
              $('.add-layer', editorEl).tooltip("destroy");
            });
          }
        };

        before();
      },

      onSelect: function() {
        var _this = this;
        var iconEl = $("span", $(this));

        $('.layer .layer-btn span', layersEl).removeClass("active");

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

    var LayerRow = {
      getCounter: function(layersRowsEl) {
        return layersRowsEl.data('counter');
      },

      incrementCounter: function(layersRowsEl) {
        var currentCounter = LayerRow.getCounter(layersRowsEl);
        layersRowsEl.data('counter', currentCounter+1);
      },

      init: function() {
        $('.add-layer-row', editorEl).click(LayerRow.onAdd);

        layersEl
          .on("click", ".layer-row .delete-layer-row", LayerRow.onDelete)
          .on("click", ".layer-row .layer-row-btn", LayerRow.onSelect)
          .on("mouseenter", ".layer-row .layer-row-btn", LayerRow.onMouseIn)
          .on("mouseleave", ".layer-row .layer-row-btn", LayerRow.onMouseOut);

        // add tooltip in Add Row Button if the layer has rows
        var panelLayerRowEl = $('.layer .layer-row:nth-child(1)', layersEl).parent();
        var addLayerRowBtn = panelLayerRowEl.parent().find('.add-layer-row');
        addLayerRowBtn.tooltip({
          placement: "right",
          title: "Add Row"
        });

        $('.gutter-choices [data-toggle="tooltip"]', layersEl).tooltip();
      },

      onAdd: function() {
        var _this = this;
        var layerEl = $(this).closest('.layer');
        var layerNum = layerEl.data('layer-number');
        var layersRowsEl = $('.panel-layers-rows', layerEl);

        var before = function() {
          $(_this).prop("disabled", true);

          $(_this).animate({
            width: 24
          }, Layer.TRANSITION, function() {
            $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
            $(_this).prop("disabled", false);
            $(_this).tooltip({
              placement: "right",
              title: "Add Row"
            });

            during();
          });

          // remove tooltip
          $(_this).tooltip("hide");
        };

        var during = function() {
          var tmpl = _.template($('#layer-row-tmpl').html());

          LayerRow.incrementCounter(layersRowsEl);
          layersRowsEl.append(tmpl({
            layer_number: layerNum,
            layer_row_number: LayerRow.getCounter(layersRowsEl),
            layer_row_content: "Lorem ipsum"
          }));
        };

        before();
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

            var layersRowsEl = $('.panel-layers-rows', layerEl);
            var hasNoRow = $('.layer-row', layersRowsEl).length === 0;

            if (hasNoRow) {
              var addLayerRowBtnEl = layersRowsEl.parent().find('.add-layer-row');

              addLayerRowBtnEl.prop("disabled", true);
              addLayerRowBtnEl.animate({
                width: 82
              }, Layer.TRANSITION, function() {
                addLayerRowBtnEl.html('<span class="glyphicon glyphicon-plus"></span> Add Row');
                addLayerRowBtnEl.prop("disabled", false);
                addLayerRowBtnEl.tooltip("destroy");
              });
            }
          });
        };

        before();
      },

      onSelect: function() {
        var _this = this;
        var iconEl = $("span", $(this));

        $('.layer-row .layer-row-btn span', layersEl).removeClass("active");

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

    var LayerRowCol = {
      getCounter: function(layersRowsColsEl) {
        return layersRowsColsEl.data('counter');
      },

      incrementCounter: function(layersRowsColsEl) {
        var currentCounter = LayerRowCol.getCounter(layersRowsColsEl);
        layersRowsColsEl.data('counter', currentCounter+1);
      },

      init: function() {
        $('.add-layer-row-col', editorEl).click(LayerRowCol.onAdd);

        layersEl
          .on("click", ".layer-row-col .delete-layer-row-col", LayerRowCol.onDelete)
          .on("click", ".layer-row-col .layer-row-col-btn", LayerRowCol.onSelect)
          .on("mouseenter", ".layer-row-col .layer-row-col-btn", LayerRowCol.onMouseIn)
          .on("mouseleave", ".layer-row-col .layer-row-col-btn", LayerRowCol.onMouseOut);

        // add tooltip in Add Row Button if the layer has rows
        var panelLayerRowColEl = $('.layer .layer-row .layer-row-col:nth-child(1)', layersEl).parent();
        var addLayerRowColBtn = panelLayerRowColEl.parent().find('.add-layer-row-col');
        addLayerRowColBtn.tooltip({
          placement: "right",
          title: "Add Col"
        });
      },

      onAdd: function() {
        var _this = this;
        var layerEl = $(this).closest('.layer');
        var layerRowEl = $('.layer-row', layerEl);
        var layerNum = layerEl.data('layer-number');
        var layerRowNum = layerEl.data('layer-row-number');

        var layersRowsColsEl = $('.panel-layers-rows-cols', layerRowEl);

        var before = function() {
          $(_this).prop("disabled", true);

          $(_this).animate({
            width: 24
          }, Layer.TRANSITION, function() {
            $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
            $(_this).prop("disabled", false);
            $(_this).tooltip({
              placement: "right",
              title: "Add Col"
            });

            during();
          });

          // remove tooltip
          $(_this).tooltip("hide");
        };

        var during = function() {
          var tmpl = _.template($('#layer-row-col-tmpl').html());

          LayerRowCol.incrementCounter(layersRowsColsEl);
          layersRowsColsEl.append(tmpl({
            layer_number: layerNum,
            layer_row_number: layersRowsColsEl,
            layer_row_col_number: LayerRowCol.getCounter(layersRowsColsEl),
            layer_row_col_content: "Lorem ipsum"
          }));
        };

        before();
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

            var layersRowsColsEl = $('.panel-layers-rows-cols', layerRowEl);
            var hasNoCol = $('.layer-row-col', layersRowsColsEl).length === 0;

            if (hasNoCol) {
              var addLayerRowColBtnEl = layersRowsColsEl.parent().find('.add-layer-row-col');

              addLayerRowColBtnEl.prop("disabled", true);
              addLayerRowColBtnEl.animate({
                width: 82
              }, Layer.TRANSITION, function() {
                addLayerRowColBtnEl.html('<span class="glyphicon glyphicon-plus"></span> Add Col');
                addLayerRowColBtnEl.prop("disabled", false);
                addLayerRowColBtnEl.tooltip("destroy");
              });
            }
          });
        };

        before();
      },

      onSelect: function() {
        // var _this = this;
        // var iconEl = $("span", $(this));

        // $('.layer-row .layer-row-btn span', layersEl).removeClass("active");

        // _.delay(function() {
        //   if (!$(_this).hasClass("collapsed")) {
        //     iconEl.addClass("active");
        //   } else {
        //     iconEl.removeClass("active");
        //   }
        // }, 100);
      },

      onMouseIn: function() {
        // var iconEl = $("span", $(this));

        // _.delay(function() {
        //   if (!iconEl.hasClass("collapsed")) {
        //     iconEl.addClass("hover");
        //   }
        // }, 100);
      },

      onMouseOut: function() {
        // var iconEl = $("span", $(this));

        // _.delay(function() {
        //   if (!iconEl.hasClass("collapsed")) {
        //     iconEl.removeClass("hover");
        //   }
        // }, 100);
      }
    };

    init();
  };
}());
