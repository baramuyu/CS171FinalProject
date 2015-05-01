
MultiLineVis = function(_parentElement){
    this.parentElement = _parentElement;
}

MultiLineVis.PickTop10 = function(_resData){
    var data = _resData;
    var res = [];
    var count = 0;

    sdata = data.sort(function(a, b) {
        return d3.descending(a["capacity"],b["capacity"]);
    });

    sdata.forEach(function(d){
        if(count <= 10)
            res.push(d)
        count++;  
    })
    return res;
}

MultiLineVis.calCapacity = function(data){
  var totalCap = 0;
  data.forEach(function(d){
      if(!isNaN(d.capacity))
          totalCap += +d.capacity;
  })
  console.log("totalCap,", totalCap)

  return totalCap;
}

MultiLineVis.createMultiLine = function(_resData, _allData){
    var data = _resData;
    var alldata = _allData;

    var margin = {top: 20, right: 200, bottom: 30, left: 100},
        width = 1160 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    //calculate total capacity
    var totalCapacity = this.calCapacity(alldata);

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(parseDate(d.date)); })
        .y(function(d) { return y(d.percentage); });

    var svg = d3.select("#multiLineVis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //x.domain(d3.extent(data, function(c) { return d3.min(c.values, function(v) { return parseDate(v.date); }); }));
      x.domain([parseDate("20000104"),parseDate("20140916")]);

      y.domain([0,100]);
      // y.domain([
      //   d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.storage; }); }),
      //   d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.storage; }); })
      // ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Storage(%)");

      var city = svg.selectAll(".city")
          .data(data)
        .enter().append("g")
          .attr("class", "city");

      city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return color(d.name); });

      city.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(parseDate(d.value.date)) + "," + y(d.value.percentage) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

}

