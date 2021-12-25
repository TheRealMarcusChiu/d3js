const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleLinear()
    .domain([-10, 10])
    .range([ 0, width ]);
const y = d3.scaleLinear()
    .domain([-5, 0])
    .range([ height, 0 ]);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));
svg.append("g")
  .call(d3.axisLeft(y));

var mean = 0;
var std = 2;
var num_random_values = 60
var random_x_values = []
for (let i = 0; i < num_random_values; i++) {
    random_x_values.push(rnorm(mean, std));
}

var data_sets = []
var focus_sets = []

for (let i = 0; i < num_random_values; i++) {
    // Generate data for the line
    const step = 0.1
    const x_data = d3.range(-10, 10, step)
    const y_data = x_data.map(x => Math.log(dnorm(random_x_values[i], x, std)))
    const data = x_data.map(function (x, j) { return { x: x, y: y_data[j] } });
    data_sets.push(data);

    // Create the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) })
      )
}

for (let i = 0; i < num_random_values; i++) {
    // Create the circle that travels along the curve of chart
    var focus = svg
        .append('g')
        .append('circle')
            .attr("stroke", "black")
            .attr('r', 2)
    focus_sets.push(focus);
}

// Create a rect on top of the svg area: this rectangle recovers mouse position
svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', mousemove);


// This allows to find the closest X index of the mouse:
var bisect = d3.bisector(function(d) { return d.x; }).left;

function mousemove() {
    // recover coordinate we need
    var p = d3.pointer(event, this);
    var p_x = p[0];
    var x0 = x.invert(p_x);

    for (let i = 0; i < num_random_values; i++) {
        let data = data_sets[i]
        let focus = focus_sets[i]
        var j = bisect(data, x0, 1);
        var selectedData = data[j]
        focus
            .attr("cx", x(selectedData.x))
            .attr("cy", y(selectedData.y))
//        focusText
//            .html("x:" + selectedData.x + "  -  " + "y:" + selectedData.y)
//            .attr("x", x(selectedData.x)+15)
//            .attr("y", y(selectedData.y))
    }
}
