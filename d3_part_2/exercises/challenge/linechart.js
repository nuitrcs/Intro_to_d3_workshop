var margin = {top: 20, right: 20, bottom: 20, left: 35},
  width = 760,
  height = 420,
  formatDate = d3.timeParse("%Y-%m-%d"),
  xValue = function(d) { return formatDate(d.date); },
  yValue = function(d) { return +d.price; },
  xScale = d3.scaleTime(),
  yScale = d3.scaleLinear(),
  //xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
  //yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-width - margin.left - margin.right),
  area = d3.area().x(X).y1(Y),
  line = d3.line().x(X).y(Y);

  // Convert data to standard representation greedily;
  // this is needed for nondeterministic accessors.
  
  data = data.map(function(d, i) {
    return [xValue.call(data, d, i), yValue.call(data, d, i)];
  });


  // Update the x-scale.
  xScale
    .domain(d3.extent(data, function(d) { return d[0]; }))
    .range([0, width - margin.left - margin.right]);

  // Update the y-scale.
  yScale
    .domain([0, 1.1*(d3.max(data, function(d) { return d[1]; }))])
    .range([height - margin.top - margin.bottom, 0]);

  // Bind data to container and create outer dimensions
  var container = d3.select("#chart")
    .append("svg")
    .attr("width", width + "px")
    .attr("height", height + "px")
    .data([data]);

  // Create the skeletal chart.
  var svg = container.append("g");
  svg.append("g").attr("class", "x axis");
  svg.append("g").attr("class", "y axis");
  svg.append("path").attr("class", "line");


  // Update the inner dimensions.
  var g = container.select("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Update the line path.
  g.select(".line")
    .attr("d", line);

  // Update the x-axis.
  g.select(".x.axis")
    .attr("transform", "translate(0," + yScale.range()[0] + ")")
    .call(d3.axisBottom(xScale).tickSize(6, 0));

  g.select(".y.axis")
    .attr("transform", "translate(0," + yScale.range()[1] + ")")
    .call(d3.axisLeft(yScale).tickSize(-width - margin.left - margin.right));

  container.selectAll("g")
    .classed("g-baseline", function(d) { return d == 0 });


// The x-accessor for the path generator; xScale âˆ˜ xValue.
function X(d) {
  return xScale(d[0]);
}

// The x-accessor for the path generator; yScale âˆ˜ yValue.
function Y(d) {
  return yScale(d[1]);
}