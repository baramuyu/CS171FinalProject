
MultiLineVis = function(_eventHandler, _color){
    this.eventHandler = _eventHandler;
    this.color = _color;
}

MultiLineVis.prototype.PickTop10 = function(_resData){
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

MultiLineVis.prototype.calCapacity = function(data){
  var totalCap = 0;
  data.forEach(function(d){
      if(!isNaN(d.capacity))
          totalCap += +d.capacity;
  })

  return totalCap;
}

MultiLineVis.prototype.createMultiLine = function(_resData, _allData){
    //this.data = _resData;
    this.data = _allData;
    var that = this;

    var margin = {top: 20, right: 200, bottom: 30, left: 100},
        width = 1160 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    //save to "this"
    this.x = x;
    this.width = width;

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    //calculate total capacity
    var totalCapacity = this.calCapacity(this.data);

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

      var lake = svg.selectAll(".lake")
          .data(this.data)
        .enter().append("g")
          .attr("class", "lake")
          .attr("id", function(d){return "L_"+d.id})
          .attr("opacity", 0);

      lake.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return that.color(d.id); });

      lake.append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + x(parseDate(d.value.date)) + "," + y(d.value.percentage) + ")"; })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) { return d.name; });

      //Always All Reservoir is shown
      d3.select("#L_ALL").style("opacity", 1)

    //create slide bar
    this.addSlider(svg);

}

MultiLineVis.prototype.updateMultiLine = function(_barId){
    barId = _barId;
    console.log("bar secected!", barId);

    d3.selectAll(".lake").style("opacity", 0)  
    d3.select("#L_ALL").style("opacity", 1)

    if(barId != ""){
        d3.select("#L_"+barId).style("opacity", 1)
    }
}

MultiLineVis.prototype.barSelected = function(_barId){
    this.updateMultiLine(_barId)
}

MultiLineVis.prototype.addSlider = function(svg){
    var that = this;
    var x = that.x;
    var width = that.width; // I don't know why I can't use "that" inside of sliderDragged functionma

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([.1,1]).range([0,width])

    var sliderDragged = function(){
        var value = Math.max(0, Math.min(width,d3.event.x));

        var sliderValue = sliderScale.invert(value);
        var selectValue = x.invert(value);

        d3.select(".sliderHandle").attr("x", function () { return sliderScale(sliderValue); })
        d3.select(".sliderHandle-bg").attr("x", function () { return sliderScale(sliderValue) - 20; })

        //change multi line chart
        $(that.eventHandler).trigger("dateChanged",selectValue);   

    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        "transform":"translate("+0+","+-30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        y:5,
        width: that.width + 5,
        height:480
    }).style({
        fill:"lightgray",
        opacity:0.1
    })
    
    sliderGroup.append("rect").attr({
            "class":"sliderHandle-bg",
            x:sliderScale(1)-20,
            width:40,
            height:480,
            rx:2,
            ry:2
        }).style({
        opacity: 0
    }).call(sliderDragBehaviour)


    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        x:sliderScale(1),
        width:10,
        height:480,
        rx:2,
        ry:2
    }).style({
        fill:"red",
        opacity: 0.3
    })


}
