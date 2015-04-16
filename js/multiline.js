/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
MultiLineVis = function(_parentElement){
    this.parentElement = _parentElement;
}

MultiLineVis.PickTop20 = function(_resData){
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

MultiLineVis.createMultiLine = function(_resData){
    var data = _resData

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

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(parseDate(d.date)); })
        .y(function(d) { return y(d.storage); });

    var svg = d3.select("#multiLineVis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      // data.forEach(function(d) {
      //   d.date = parseDate(d.date);
      // });

      // var cities = color.domain().map(function(name) {
      //   return {
      //     name: name,
      //     values: data.map(function(d) {
      //       return {date: d.date, temperature: +d[name]};
      //     })
      //   };
      // });
      
      x.domain(d3.extent(data, function(c) { return d3.min(c.values, function(v) { return parseDate(v.date); }); }));

      y.domain([
        d3.min(data, function(c) { return d3.min(c.values, function(v) { return v.storage; }); }),
        d3.max(data, function(c) { return d3.max(c.values, function(v) { return v.storage; }); })
      ]);

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
          .text("Storage(Mgal?)");

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
          .attr("transform", function(d) { return "translate(" + x(parseDate(d.value.date)) + "," + y(d.value.storage) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

}

