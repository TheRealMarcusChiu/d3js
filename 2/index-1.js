const margin = {top: 50, right: 50, bottom: 50, left: 50};

const svgWidth = 460;
const svgHeight = 400;
const scaleWidth = svgWidth - margin.left - margin.right
const scaleHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
  function(d){
    return {
      date  : d3.timeParse("%Y-%m-%d")(d.date),
      value : d.value
    }
  }
 )
.then(
  function(data) {
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([0, scaleWidth]);
    svg.append("g")
      .attr("transform", `translate(0, ${scaleHeight})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([scaleHeight, 0])
      .nice();

    // y-axis #1
//    svg.append("g")
//      .call(d3.axisLeft(y));

    // y-axis #2
    svg.append("g")
      .attr("transform", `translate(0,0)`)
      .call(d3.axisLeft(y).ticks(svgHeight / 20))
      .call(g => g.select(".domain").remove())     // removes the vertical bar
      .call(g => g.selectAll(".tick line").clone() // create a clone of tick and transform into line
         .attr("x2", scaleWidth)
         .attr("stroke-opacity", 0.1));

//    Method #1
    const points = [];
    for (var i = 0; i < data.length; i++) {
       d = data[i];
       points.push([x(d.date), y(d.value)]);
    }
    const lineGenerator = d3.line();
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", lineGenerator(points))

//    Method #2
//    svg.append("path")
//      .attr("fill", "none")
//      .attr("stroke", "steelblue")
//      .datum(data)
//      .attr("d", d3.line()
//        .x(function(d) { return x(d.date) })
//        .y(function(d) { return y(d.value) })
//      )
})