/* BOILERPLATE CODE */
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
    .on("click",morph);

/*
    The function below does not need to be part of your async callback
    This is simply bound to your elements during the callback
*/

function morph(d,i) {
    // Now it makes sense why we saved a selection as a variable!
    // (we can simply access the selection again later)
    bars
        .transition()
        .duration(1000)
        .attr("width", function(d){
            d.radius = 3+d.frequency*100
            d.diameter = d.radius*2
            return d.diameter
        })
        .attr("height", function(d){
            return d.diameter
        })
        .attr("rx",function(d){
            return d.diameter
        })
        .attr("ry",function(d){
            return d.diameter
        })
        .attr("x",function(d,i){
            var new_x = +d3.select(this).attr("x") + x.bandwidth()/2 - d.radius
            return new_x
        });
}