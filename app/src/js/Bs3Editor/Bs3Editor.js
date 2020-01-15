var overlay = require("./Overlay");
var layer = require("./Layer");
var layerRow = require("./LayerRow");
var layerRowCol = require("./LayerRowCol");

function Bs3Editor() {}

Bs3Editor.initialized = false;
Bs3Editor.init = function() {
  if (!Bs3Editor.initialized) {
    Bs3Editor.initialized = true;

    var editorEl = $('#bs3-editor');
    var layersEl = $('#bs3-ed-layers');

    overlay.init(editorEl);

    layer.init(editorEl, layersEl);
    layerRow.init(layersEl);
    layerRowCol.init(layersEl);
  }
};

module.exports = Bs3Editor;
