var tooltip = d3.select("body").append("div").attr("class", "tooltip");
var colors = ["#00A0B0","#CC333F","#EDC951","#58B947"]

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
    .attr("height", function(d) { return height - y(d.frequency); })
    .on("mousemove",mousemove)
    .on("mouseout",mouseout)
    .on('click',color)

function mouseout(d,i) {
    d3.select(this)
        .style('fill',function(d,i){
            return colors[d.color_index]
        })
    tooltip
        .style("display", "none");
};
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function mousemove(d,i) {
    d3.select(this)
        .style('fill','lemonchiffon')
    tooltip
        .html("Letter: " + d.letter + "<br>Frequency: " + round(d.frequency*100,2) + "%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2,
        h = tooltip.node().offsetHeight*1.1;

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}

function color() {
    d3.selectAll(".bar")
        .transition("color")
        .ease(d3.easeLinear)
        .duration(1000)
        .delay(function(d,i){
            return i*250
        })
        .style("fill", function(d,i){
            if (!d.color_index) {
                d.color_index = 4
            }
            if (d.color_index < 4) {
                d.color_index++
            } else {
                d.color_index = 1
            }
            return colors[d.color_index-1]
        })
        .call(endall,color)
}
//Transition callback runs when ALL elements have finished
function endall(transition, callback) { 
    var n = 0; 
    transition 
        .each(function() { ++n; }) 
        .on("end", function() { if (!--n) callback.apply(this, arguments); }); 
}