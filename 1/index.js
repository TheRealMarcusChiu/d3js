// Select DOM elements
var p = d3.select("body")
    .selectAll("p");

// Bind Data
p = p.data([4, 8, 15, 16, 23, 42]);

// Update
p.text(function(d) { return d; });

// Enter
p.enter()
    .append("p")
    .text(function(d) { return d; });

p = d3.select("body")
    .selectAll("p")
    .data([40, 80, 150, 160, 230, 420])
    .text(function(d) { return d; })
    .enter()
    .append("p")
    .text(function(d) { return d; });