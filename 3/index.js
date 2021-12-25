function generate_random_values(size=0, mean=0, std=1) {
    const random_values = []
    for (let i = 0; i < size; i++) {
        random_values.push(rnorm(mean, std));
    }
    return random_values;
}

function generate_data_sets(random_x_values=[], std=1) {
    const data_sets = [];

    const step = 0.1
    const x_data = d3.range(-10, 10, step);
    for (let i = 0; i < random_x_values.length; i++) {
        const y_data = x_data.map(x => Math.log(dnorm(random_x_values[i], x, std)))
        const data = x_data.map(function (x, j) { return { x: x, y: y_data[j] } });
        data_sets.push(data);
    }

    return data_sets;
}

const margin = {top: 10, right: 30, bottom: 30, left: 60}
const width = 460 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom;
var mean = document.getElementById("slider_mean").value;
var std = document.getElementById("slider_std").value;
var num_random_values = 5
var random_x_values = generate_random_values(num_random_values, mean, std);
var data_sets = generate_data_sets(random_x_values, std);


class Plot {
    constructor(svg_id, margin, width, height) {
        this.margin = margin
        this.width = width
        this.height = height
        this.svg = d3
          .select(svg_id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        this.x = d3.scaleLinear()
            .domain([-10, 10])
            .range([ 0, width ]);
        this.y = d3.scaleLinear()
            .domain([-5, 0])
            .range([ height, 0 ]);
        this.svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(this.x));
        this.svg.append("g")
          .call(d3.axisLeft(this.y));
    }

    initializeDataSets(num_random_values, data_sets) {
        this.num_random_values = num_random_values;
        this.data_sets = data_sets;
        this.focus_sets = [];

        for (let i = 0; i < num_random_values; i++) {
            var that = this;
            // Create the line
            var path = this.svg.selectAll("path").data(data_sets[i]);
            path.attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-opacity", 0.3)
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(function(d) { return that.x(d.x) })
                    .y(function(d) { return that.y(d.y) })
                );
            path.enter().append("path")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-opacity", 0.3)
                .attr("stroke-width", 2)
                .attr("d", d3.line()
                    .x(function(d) { return that.x(d.x) })
                    .y(function(d) { return that.y(d.y) })
                );
            path.exit().remove();
        }

        for (let i = 0; i < num_random_values; i++) {
            // Create the circle that travels along the curve of chart
            var focus = this.svg
                .append('g')
                .append('circle')
                    .attr("stroke", "black")
                    .attr('r', 2)
            this.focus_sets.push(focus);
        }
    }

    updateFocusSet(pointer) {
        var p_x = pointer[0];
        var x0 = this.x.invert(p_x);

        for (let i = 0; i < this.num_random_values; i++) {
            let data = this.data_sets[i]
            let focus = this.focus_sets[i]
            var j = bisect(data, x0, 1);
            var selectedData = data[j]
            focus
                .attr("cx", this.x(selectedData.x))
                .attr("cy", this.y(selectedData.y))
        }
    }
}

const plot1 = new Plot("#plot1", margin, width, height);
plot1.initializeDataSets(num_random_values, data_sets);
//plot1.initializeDataSets(num_random_values, data_sets);

// Create a rect on top of the svg area: this rectangle recovers mouse position
plot1.svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', mousemove);

// This allows to find the closest X index of the mouse:
const bisect = d3.bisector(function(d) { return d.x; }).left;

function mousemove() {
    // recover coordinate we need
    var pointer = d3.pointer(event, this);
    plot1.updateFocusSet(pointer);
}
