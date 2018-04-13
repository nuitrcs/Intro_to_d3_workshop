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
    .on("click",sort);

/*
    The functions below do not need to be part of your async callback
    These simply are bound to your elements during the callback
*/
var sortedData;
function freqDescending(a,b) {
    return b.frequency - a.frequency
}
/*
function sort() {
    sortedData = data.slice().sort(freqDescending)

    console.log(data)
    console.log(sortedData)
    bars
        .data(sortedData)
        .attr("x", function(d) { return x(d.letter); })

}
function sort() {
    data.sort(freqDescending)

    x.domain(data.map(function(d) { return d.letter; }))

    bars
        .attr("x", function(d) { return x(d.letter); })

}

function sort() {
    data.sort(freqDescending)

    x.domain(data.map(function(d) { return d.letter; }))

    bars
        .transition()
        .duration(1600)
        .attr("x", function(d) { return x(d.letter); })

    xaxis
        .transition()
        .duration(1600)
        .call(d3.axisBottom(x))
}*/
function sort() {
    data.sort(freqDescending)

    x.domain(data.map(function(d) { return d.letter; }))

    bars
        .transition()
        .ease(d3.easeBounce) //https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        .duration(1600)
        .attr("x", function(d) { 
            console.log(this)
            console.log(d3.select(this))
            console.log(d3.select(this).node())
            return x(d.letter); 
        })

    xaxis
        .transition()
        .ease(d3.easeBounce)
        .duration(1600)
        .call(d3.axisBottom(x))
}