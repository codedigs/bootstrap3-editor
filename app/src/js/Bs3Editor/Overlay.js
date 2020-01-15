function Overlay() {}

Overlay.initialized = false;
Overlay.initialCursorCoor = {x: 0, y: 0};
Overlay.initialEditorCoor = {x: 0, y: 0};
Overlay.readyToDrag = false;

Overlay.init = function(editorEl) {
  if (!Overlay.initialized) {
    Overlay.initialized = true;
    Overlay.editorEl = editorEl;

    $(':input[name="overlay"]', Overlay.editorEl).click(Overlay.eventListeners.onClick);
  }
};

Overlay.eventListeners = {
  onClick: function() {
    var is_overlay = $(this).is(":checked");

    if (is_overlay) {
      $('#playground').parent().removeClass("col-xs-8").addClass("col-xs-12");

      Overlay.editorEl.addClass("overlay")
        .parent()
        .parent().removeClass("col-xs-4");

      $('.panel-heading .move-tool', Overlay.editorEl)
        .mousedown(Overlay.eventListeners.onReadyToDrag)
        .mousemove(Overlay.eventListeners.onDragging)
        .on("mouseup mouseleave", Overlay.eventListeners.onStopToDrag);

      $('.panel-heading .move-tool', Overlay.editorEl).show();

      var OFFSET = 15;

      Overlay.editorEl.css({
        top: OFFSET + 31, // 31 for move tool icon
        left: OFFSET
      });
    } else {
      $('#playground').parent().removeClass("col-xs-12").addClass("col-xs-8");

      Overlay.editorEl.removeClass("overlay")
        .parent()
        .parent().addClass("col-xs-4");

      $('.panel-heading .move-tool', Overlay.editorEl).off("mousedown", Overlay.eventListeners.onReadyToDrag)
        .off("mousemove", Overlay.eventListeners.onDragging)
        .off("mouseup mouseleave", Overlay.eventListeners.onStopToDrag);

      $('.panel-heading .move-tool', Overlay.editorEl).hide();
    }
  },

  onReadyToDrag: function(e) {
    var moveTooloffset = $('.panel-heading .move-tool', Overlay.editorEl).offset();
    var moveToolWidth = $('.panel-heading .move-tool', Overlay.editorEl).width();
    var moveToolHeight = $('.panel-heading .move-tool', Overlay.editorEl).height();

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
      Overlay.readyToDrag = true;
      Overlay.initialCursorCoor = {
        x: e.pageX,
        y: e.pageY
      };

      var offset = Overlay.editorEl.offset();
      Overlay.initialEditorCoor = {
        x: offset.left,
        y: offset.top
      };
    }
  },

  onDragging: function(e) {
    if (Overlay.readyToDrag) {
      var top = e.pageY - Overlay.initialCursorCoor.y;
      var left = e.pageX - Overlay.initialCursorCoor.x;

      Overlay.editorEl.css({
        top: Overlay.initialEditorCoor.y + top,
        left: Overlay.initialEditorCoor.x + left
      });
    }
  },

  onStopToDrag: function() {
    Overlay.readyToDrag = false;
  }
};

module.exports = Overlay;
