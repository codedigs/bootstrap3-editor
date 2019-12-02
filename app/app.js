var App = {
    init: function() {
        var totalHeight = $(window).height();
        $('#playground').height(totalHeight - (15*2 + 2)); // less the margin top and bottom and border
    }
};

$(document).ready(App.init);