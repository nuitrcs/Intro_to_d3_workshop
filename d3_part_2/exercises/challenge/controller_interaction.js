/* BOILERPLATE CODE */
var tooltip = d3.select("body").append("div").attr("class", "tooltip");

var svg = d3.select("#graph")
    .attr("width",960)
    .attr("height",500);
    
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* 
    The code below only works if your data is available
    Otherwise, this should go into a callback function (for async)
*/
x.domain(data.map(function(d) { return d.letter; }));

y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

var xaxis = g.append("g")
    .data(data)
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

var yaxis = g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(5, "%"))

var bars = g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("y", function(d) { return y(d.frequency); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.frequency); })
    .on("mousemove",mousemove)
    .on("mouseout",mouseout);

/*
    The functions below do not need to be part of your async callback
    These simply are bound to your elements during the callback
*/

function mouseout(d,i) {
    tooltip
        .style("display", "none");
};
/*
function mousemove(d,i) {
    tooltip
        .text(d.letter + ": " + d.frequency + "%")
        .style("display", "inline-block")

    tooltip
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
}

function mousemove(d,i) {
    tooltip
        .text(d.letter + ": " + d.frequency + "%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2, //once we draw the tooltip, we use its size to determine the offset
        h = tooltip.node().offsetHeight*1.1; // we must call the node() to use the vanilla JS "offset" properties

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}

function mousemove(d,i) {
    tooltip
        .text(d.letter + ": " + Math.round(d.frequency) + "%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2, //once we draw the tooltip, we use its size to determine the offset
        h = tooltip.node().offsetHeight*1.1; // we must call the node() to use the vanilla JS "offset" properties

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}*/
//helpful rounding function
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function mousemove(d,i) {
    tooltip
        .html("Letter: " + d.letter + "<br>Frequency: " + round(d.frequency*100,2) + "%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2,
        h = tooltip.node().offsetHeight*1.1;

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}

