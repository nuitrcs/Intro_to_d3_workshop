var svg = d3.select("#graph")
    .attr("width",960)
    .attr("height",500);

var g = svg.append("g");

g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("width", 20)
    .attr("height", function(d,i) { 
        console.log(this)
        console.log(d)
        console.log(i)
        console.log(d3.select(this))
        return d.frequency*1000; 
    })
    .attr("x", function(d,i) { return i*22; })