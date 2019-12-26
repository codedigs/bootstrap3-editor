var App = (function() {
  var init = function() {
    var totalHeight = $(window).height();
    $('#playground').height(totalHeight - (15 * 2 + 2)); // less the margin top and bottom and border

    $('#bs3-editor :input[name="overlay"]').click(Overlay.onClick);

    $('#add-layer').click(Layer.onAdd);

    $('#bs3-ed-layers .panel-title')
      .on("mouseenter", "a", Layer.onMouseIn)
      .on("mouseleave", "a", Layer.onMouseOut);

    $('#bs3-ed-layers .panel-title').on("click", "a", Layer.onSelect);
  };

  var DragEvent = {
    cursorOrigin: {
      x: 0, y: 0
    },
    objectOrigin: {
      x: 0, y: 0
    },
    readyToDrag: false,

    onReadyToDrag: function(e) {
      var moveTooloffset = $('#bs3-editor .panel-heading .move-tool').offset();
      var moveToolWidth = $('#bs3-editor .panel-heading .move-tool').width();
      var moveToolHeight = $('#bs3-editor .panel-heading .move-tool').height();

      var moveToolPos = {
          pt1: {
              x: moveTooloffset.left,
              y: moveTooloffset.top
          },
          pt2: {},
          pt3: {},
          pt4: {}
      };

      moveToolPos.pt2.x = moveToolPos.pt1.x + moveToolWidth;
      moveToolPos.pt2.y = moveToolPos.pt1.y;
      moveToolPos.pt3.x = moveToolPos.pt1.x;
      moveToolPos.pt3.y = moveToolPos.pt1.y + moveToolHeight;
      moveToolPos.pt4.x = moveToolPos.pt1.x + moveToolWidth;
      moveToolPos.pt4.y = moveToolPos.pt1.y + moveToolHeight;

      console.log(moveToolPos);

      if (
        (e.pageX > moveToolPos.pt1.x && e.pageY > moveToolPos.pt1.y) &&
        (e.pageX > moveToolPos.pt1.x && e.pageY > moveToolPos.pt1.y) &&
        (e.pageX > moveToolPos.pt1.x && e.pageY > moveToolPos.pt1.y) &&
        (e.pageX > moveToolPos.pt1.x && e.pageY > moveToolPos.pt1.y)
      )

      DragEvent.readyToDrag = true;
      DragEvent.cursorOrigin = {
        x: e.pageX,
        y: e.pageY
      };

      var offset = $('#bs3-editor').offset();
      DragEvent.objectOrigin = {
        x: offset.left,
        y: offset.top
      };

      $('#bs3-editor .panel-heading .move-tool').css('cursor', "move");
    },

    onDragging: function(e) {
      if (DragEvent.readyToDrag) {
        console.log({x: e.pageX, y: e.pageY});

        var top = e.pageY - DragEvent.cursorOrigin.y;
        var left = e.pageX - DragEvent.cursorOrigin.x;

        $('#bs3-editor').css({
          top: DragEvent.objectOrigin.y + top,
          left: DragEvent.objectOrigin.x + left
        });

        console.log("dragging!!!");
      }
    },

    onStopToDrag: function() {
      DragEvent.readyToDrag = false;

      $('#bs3-editor .panel-heading').css('cursor', "default");
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
