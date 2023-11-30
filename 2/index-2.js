const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
  function(d) {
    return {
      date : d3.timeParse("%Y-%m-%d")(d.date),
      value : d.value
    }
  }
).then(
  function(data) {
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    xAxis = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    yAxis = svg.append("g")
      .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs")
        .append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Create SVG with clipping
    const clippedArea = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Add the line into clipped area
    const line = clippedArea.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.0)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
      )

    // create d3 brush
    const d3Brush = d3.brushX()               // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
    // Add brush into clipped area
    const brush = clippedArea.append("g")
        .call(d3Brush);

    // A function that set idleTimeOut to null
    let idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event, d) {
      // What are the selected boundaries?
      extent = event.selection

      if (!extent) return

      // Update x-domain
      x1 = x.invert(extent[0])
      x2 = x.invert(extent[1])
      x.domain([x1, x2])

      // Remove the grey brush area as soon as the selection has been done
      brush.call(d3Brush.move, null)

      // Update x-axis
      xAxis.transition().duration(1000).call(d3.axisBottom(x))

      // Update line
      line.transition().duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
          )
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function() {
      x.domain(d3.extent(data, function(d) { return d.date; }))
      xAxis.transition().call(d3.axisBottom(x))
      line.transition()
          .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
          )
    });

})