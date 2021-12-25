var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    margin = {top: 20, right: 30, bottom: 30, left: 40};

var x = d3.scaleLinear()
    .domain([-10, 0])
    .range([margin.left, width - margin.right]);
var y = d3.scaleLinear()
    .domain([0, 0.5])
    .range([height - margin.bottom, margin.top]);

svg.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(d3.axisBottom(x))
  .append("text")
    .attr("x", width - margin.right)
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .attr("font-weight", "bold");

svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).ticks(null, "%"));

faithful = [-10,-9,-8,-4,-1,-1,-3,-2,-1.5, -1.2]
var num_bins = 10
var n = faithful.length,
  bins = d3.histogram().domain(x.domain()).thresholds(num_bins)(faithful),
  density = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(num_bins))(faithful);

svg.insert("g", "*")
  .attr("fill", "#bbb")
.selectAll("rect")
.data(bins)
.enter().append("rect")
  .attr("x", function(d) { return x(d.x0) + 1; })
  .attr("y", function(d) { return y(d.length / n); })
  .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
  .attr("height", function(d) { return y(0) - y(d.length / n); });

svg.append("path")
  .datum(density)
  .attr("fill", "none")
  .attr("stroke", "#000")
  .attr("stroke-width", 1.5)
  .attr("stroke-linejoin", "round")
  .attr("d",  d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return y(d[1]); }));

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}