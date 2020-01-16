var overlay = require("./Overlay");
var layer = require("./Layer");
var layerRow = require("./LayerRow");
var layerRowCol = require("./LayerRowCol");

function Bs3Editor() {}

Bs3Editor.initialized = false;
Bs3Editor.init = function() {
  if (!Bs3Editor.initialized) {
    Bs3Editor.initialized = true;

    var pgEl = $('#playground');
    var editorEl = $('#bs3-editor');
    var layersEl = $('#bs3-ed-layers');

    overlay.init(editorEl);

    layer.init(pgEl, editorEl, layersEl);
    layerRow.init(pgEl, layersEl);
    layerRowCol.init(pgEl, layersEl);

    $('input[name="show_grid"]', editorEl).click(Bs3Editor.eventListeners.onShowGrid);
  }
};

Bs3Editor.eventListeners = {
  onShowGrid: function() {
    $('#playground')[$(this).is(":checked") ? "addClass" : "removeClass"]("show-grid");
  }
};

module.exports = Bs3Editor;
