var App = (function() {
  var init = function() {
    var totalHeight = $(window).height();
    $('#playground').height(totalHeight - (15 * 2 + 2)); // less the margin top and bottom and border

    $('#bs3-editor :input[name="overlay"]').click(Overlay.onClick);

    $('#add-layer').click(Layer.onAdd);
    $('#bs3-ed-layers').on("click", ".delete-layer", Layer.onDeleteLayer);

    $('#bs3-ed-layers .panel-title')
      .on("mouseenter", "a", Layer.onMouseIn)
      .on("mouseleave", "a", Layer.onMouseOut);

    $('#bs3-ed-layers .panel-title').on("click", "a", Layer.onSelect);
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
      var moveTooloffset = $('#bs3-editor .panel-heading .move-tool').offset();
      var moveToolWidth = $('#bs3-editor .panel-heading .move-tool').width();
      var moveToolHeight = $('#bs3-editor .panel-heading .move-tool').height();

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

        var offset = $('#bs3-editor').offset();
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

        $('#bs3-editor').css({
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
      console.log($(this).is(":checked"));
      var is_overlay = $(this).is(":checked");

      if (is_overlay) {
        $('#playground').parent().removeClass("col-xs-8").addClass("col-xs-12");

        $('#bs3-editor').addClass("overlay")
          .parent()
          .parent().removeClass("col-xs-4");

        $(window)
          .mousedown(DragEvent.onReadyToDrag)
          .mousemove(DragEvent.onDragging)
          .on("mouseup mouseleave", DragEvent.onStopToDrag);

        $('#bs3-editor .panel-heading .move-tool').show();

        var OFFSET = 15;

        $('#bs3-editor').css({
          top: OFFSET + 31, // 31 for move tool icon
          left: OFFSET
        });
      } else {
        $('#playground').parent().removeClass("col-xs-12").addClass("col-xs-8");

        $('#bs3-editor').removeClass("overlay")
          .parent()
          .parent().addClass("col-xs-4");

        // $('#bs3-editor .panel-heading .move-tool').off("mousedown", DragEvent.onReadyToDrag)
        //   .off("mousemove", DragEvent.onDragging)
        //   .off("mouseup mouseleave", DragEvent.onStopToDrag);

        $('#bs3-editor .panel-heading .move-tool').hide();
      }
    }
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

        var tmpl = _.template($('#layer-item-tmpl').html());

        var layers_len = $('#bs3-ed-layers .layer-item:visible').length;

        $('#bs3-ed-layers').append(tmpl({
          layer_name: "Layer " + (layers_len+1),
          layer_id: "bs3-ed-layer" + (layers_len+1),
          layer_content: "Lorem ipsum"
        }));

        var isLayerVisible = $('#bs3-ed-layers:visible').length > 0;

        if (!isLayerVisible) {
          $('#bs3-ed-layers').show();
        }

        console.log('add layer');
      });
    },

    onDeleteLayer: function() {
      var _this = this;
      $(this).prop("disabled", true);

      var layer_name = $(this).data("layer-name");

      smkConfirm("Do you want to delete layer " + layer_name, function(isYes) {
        $(_this).prop("disabled", false);

        if (isYes) {
          $(_this).closest('.layer-item').fadeOut(function() {
            this.remove();

            if ($('#bs3-ed-layers .layer-item:visible').length < 1) {
              $('#add-layer').prop("disabled", true);

              $('#add-layer').animate({
                width: 82
              }, Layer.TRANSITION, function() {
                $('#add-layer').html('<span class="glyphicon glyphicon-plus"></span> Add Layer');
                $('#add-layer').prop("disabled", false);
              });

              $('#bs3-ed-layers').hide();
            }
          });
        }
      });
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
