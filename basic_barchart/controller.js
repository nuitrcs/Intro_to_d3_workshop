// We are setting up our main container, this has static dimensions
var svg = d3.select("#graph")
    .attr("width",960)
    .attr("height",500);
    
// These will give padding inside our container, so our stuff can fit
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// We are setting up our scales - 'range' is our pixel space
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Finishing our scales - 'domain' is our data's space
x.domain(data.map(function(d) { return d.letter; }));
y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

// This will be the 'group' element that holds all the stuff we draw for this chart
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// We draw the x axis, using our scale ('x' the variable is our scale)
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// We draw the y axis now, setting some parameters for it
g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"))

// Now we draw our main geometry - the bars
g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("y", function(d) { return y(d.frequency); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.frequency); });