var Bs3Editor;
(function() {
  // singleton
  var instanstiated = false;
  Bs3Editor = function() {
    if (instanstiated) { return false; }
    instanstiated = true;

    var editorEl = $('#bs3-editor');
    var layerEl = $('#bs3-ed-layers');

    var init = function() {
      $(':input[name="overlay"]', editorEl).click(Overlay.onClick);

      $('.add-layer').click(Layer.onAdd);
      layerEl.on("click", ".delete-layer", Layer.onDelete);

      layerEl
        .on("mouseenter", ".layer-item a", Layer.onMouseIn)
        .on("mouseleave", ".layer-item a", Layer.onMouseOut);

      layerEl.on("click", ".layer-item a", Layer.onSelect);
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

          console.log("dragging!!!");
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

      onAdd: function() {
        var _this = this;

        var before = function() {
          $(_this).prop("disabled", true);

          $(_this).animate({
            width: 24
          }, Layer.TRANSITION, function() {
            $(_this).html('<span class="glyphicon glyphicon-plus"></span>');
            $(_this).prop("disabled", false);

            during();
          });
        };

        var during = function(afterCallback) {
          var tmpl = _.template($('#layer-item-tmpl').html());

          var layers_len = $('.layer-item:visible', layerEl).length;

          layerEl.append(tmpl({
            layer_name: "Layer " + (layers_len+1),
            layer_id: "bs3-ed-layer" + (layers_len+1),
            layer_content: "Lorem ipsum"
          }));

          after();
        };

        var after = function() {
          var isLayerVisible = $(':visible', layerEl).length > 0;

          if (!isLayerVisible) {
            layerEl.show();
          }
        };

        before();
      },

      onDelete: function() {
        var _this = this;

        var before = function() {
          $(_this).prop("disabled", true);

          var layer_name = $(_this).data("layer-name");

          smkConfirm("Do you want to delete layer " + layer_name, function(isYes) {
            $(_this).prop("disabled", false);

            if (isYes) {
              during();
            }
          });
        };

        var during = function() {
          $(_this).closest('.layer-item').fadeOut(function() {
            this.remove();

            after();
          });
        };

        var after = function() {
          if ($('.layer-item:visible', layerEl).length < 1) {
            $('.add-layer', editorEl).prop("disabled", true);

            $('.add-layer', editorEl).animate({
              width: 82
            }, Layer.TRANSITION, function() {
              $('.add-layer', editorEl).html('<span class="glyphicon glyphicon-plus"></span> Add Layer');
              $('.add-layer', editorEl).prop("disabled", false);
            });

            layerEl.hide();
          }
        };

        before();
      },

      onSelect: function() {
        var _this = this;
        var iconEl = $("span", $(this));

        $('.panel-title a span', layerEl).removeClass("active");

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
  };
}());
