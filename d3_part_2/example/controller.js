var scales = {
    x : {},
    y : {}
}
var database = {}
var statuses = {}
var charts = {
    height: 400,
    width: 760,
    margin: {top: 20, right: 20, bottom: 30, left: 40}
}
var colors = ["#00A0B0","#CC333F","#EDC951","#58B947"]
var tooltip = d3.select("body").append("div").attr("class", "tooltip")

function draw(target,special_class,animation) {
    var svg = d3.select(target)
        .attr("width",charts.width)
        .attr("height",charts.height);
    
    var margin = charts.margin,
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.letter; }));

    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    var xaxis = g.append("g")
        .data(data)
        .attr("class", "axis axis--x axisx_" + special_class)
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var yaxis = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5, "%"))

    var bars = g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar " + special_class)
        .attr("x", function(d) { return x(d.letter); })
        .attr("y", function(d) { return y(d.frequency); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.frequency); })
        .on("click",animation)
        .on("mousemove",mousemove)
        .on("mouseout",mouseout);

    scales.x[special_class] = x;
    scales.y[special_class] = y;
    database[special_class] = data;
    statuses[special_class] = true
}

function grow() {
    statuses.grow = !statuses.grow

    d3.selectAll(".grow")
        .transition("growing")
        .ease(d3.easeLinear)
        .duration(1400)
        .delay(function(d,i){
            return 1000 + i*100
        })
        .attr("height",function(d,i){
            if (statuses.grow) {
                return charts.height - charts.margin.bottom - charts.margin.top - scales.y.grow(d.frequency)
            }
            return 0
        })
        .attr("y",function(d,i){
            if (statuses.grow) {
                return scales.y.grow(d.frequency)
            }
            return scales.y.grow(0)
        })
        .call(endall,grow)
}

function move() {
    statuses.move = !statuses.move

    var mover = database.move.shift()
    database.move.push(mover)

    scales.x.move.domain(database.move.map(function(d) { return d.letter; }))

    d3.selectAll(".move")
        .transition("moving")
        .ease(d3.easeExp)
        .duration(3000)
        .delay(200)
        .attr("x", function(d) { return scales.x.move(d.letter); })
        .call(endall,move)

    d3.selectAll(".axisx_move")
        .transition("moving")
        .ease(d3.easeExp)
        .duration(3000)
        .delay(200)
        .call(d3.axisBottom(scales.x.move))
}

function sort() {
    statuses.sort = !statuses.sort
    if (!database.unsort) {
        database.unsort = database.sort;
        database.sort = data.slice().sort(freqDescending);
    }
    var switch_to_data = database.sort
    if (statuses.sort) {
        switch_to_data = database.unsort
    }
    
    scales.x.sort.domain(switch_to_data.map(function(d) { return d.letter; }))

    d3.selectAll(".sort")
        .transition("sorting")
        .ease(d3.easeBounce)
        .duration(3000)
        .delay(2000)
        .attr("x", function(d) { return scales.x.sort(d.letter); })
        .call(endall,sort)

    d3.selectAll(".axisx_sort")
        .transition("sorting")
        .ease(d3.easeBounce)
        .duration(3000)
        .delay(2000)
        .call(d3.axisBottom(scales.x.sort))
}

function color() {
    d3.selectAll(".color")
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

function freqDescending(a,b) {
    return b.frequency - a.frequency
}

//helpful rounding function
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

//Transition callback runs when ALL elements have finished
function endall(transition, callback) { 
    var n = 0; 
    transition 
        .each(function() { ++n; }) 
        .on("end", function() { if (!--n) callback.apply(this, arguments); }); 
}

function mouseout(d,i) {
    tooltip
        .style("display", "none");
};

function clickall() {
    var e = document.createEvent('UIEvents');
    e.initUIEvent('click', true, true, window, 1);

    d3.selectAll('.bar')
        .transition()
        .duration(800)
        .delay(function(d,i){
            return i*40
        })
        .style("fill",function(d,i){
            var color_index = d3.select(this).classed("grow") ? 0 : d3.select(this).classed("move") ? 1 : d3.select(this).classed("sort") ? 2 : 3;
            return colors[color_index]
        })
        .call(endall,function(){
            d3.select(".grow").node().dispatchEvent(e);
            setTimeout(function(){ 
                d3.select(".move").node().dispatchEvent(e);
                setTimeout(function(){ 
                    d3.select(".sort").node().dispatchEvent(e);
                    setTimeout(function(){ 
                        d3.select(".color").node().dispatchEvent(e);
                    }, 2300)
                }, 50)
            }, 1500)
        })
}

function mousemove(d,i) {
    tooltip
        .html("Letter: <b>" + d.letter + "</b><br>Frequency: <b>" + round(d.frequency*100,2) + "</b>%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2,
        h = tooltip.node().offsetHeight*1.1;

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}

draw("#grow","grow",grow)
draw("#move","move",move)
draw("#sort","sort",sort)
draw("#color","color",color)
d3.select("#title").on("click",clickall)