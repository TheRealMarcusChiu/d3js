function setup(data) {
    // Select DOM elements & Bind Data
    p = d3.select("body").selectAll("p").data(data);
    // Update Existing DOM elements (when necessary)
    p
        .text(function(d) { return d.x; });
    // Insert New DOM Elements (when necessary)
    p.enter().append("p")
        .text(function(d) { return d.x; });
    // Delete Existing DOM elements (when necessary)
    p.exit().remove();
}

var data1 = [{x: 4}, {x: 8}, {x: 15}, {x: 16}, {x: 23}, {x: 42}];
var data2 = [{x: 40}, {x: 80}];
var data3 = [{x: 40}, {x: 80}, {x: 150}, {x: 1}, {x: 1}, {x: 1}, {x: 1}];

setup(data1);
setup(data2);
setup(data3);