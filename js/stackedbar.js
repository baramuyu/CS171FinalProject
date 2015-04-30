StackedBarVis = function(_parentElement){
    this.parentElement = _parentElement;
}


StackedBarVis.createStackBar = function(_resData){

    var oldData = _resData;

    var margin = {top: 20, right: 500, bottom: 30, left: 40},
        width = 1500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var color = d3.scale.category20()

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#stackedbarVis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Data wrangling
      var y0 = 0;
      var y1 = 0;
      data = 
      [{
          state: "Storage on mm/dd/yyyy",
          storages: oldData.map(function(d) {
                        var latestData = d.values.length - 1;
                        return {
                            "name": d.name,
                            "y0": 0, //temporary
                            "y1": 0, //temporary
                            "value": +d.values[latestData].storage,
                            "capacity": +d.capacity
                        }
                    }),
          total: 0 //temporary
      },
      {
          state: "Storage Capacity",
          storages: oldData.map(function(d) {
                        var latestData = d.values.length - 1;
                        return {
                            "name": d.name,
                            "y0": 0, //temporary
                            "y1": 0, //temporary
                            "capacity": (!isNaN(d.capacity)) ? +d.capacity : 0
                        }
                    }),
          total: 0 //temporary
      }]

       //sorting
      data[0].storages = data[0].storages.sort(function(a, b){
          return d3.descending(a["capacity"], b["capacity"]);
      })
      data[1].storages = data[1].storages.sort(function(a, b){
          return d3.descending(a["capacity"], b["capacity"]);
      })
      
      //Current
      //update y0,y1
      var y0 = 0;
      var y1 = 0;
      //current storage
      data[0].storages.map(function(d){
          y0 = y1;
          y1 = y0 + d.value;
          d.y0 = y0;
          d.y1 = y1;
      })

      //update total
      data[0].total = y1;

      //Capaity
      //update y0,y1
      var y0 = 0;
      var y1 = 0;
      //current storage
      data[1].storages.map(function(d){
          y0 = y1;
          y1 = y0 + d.capacity;
          d.y0 = y0;
          d.y1 = y1;
      })

      //update total
      data[1].total = y1;


      //total capacity
      var totalCap = 0;
      oldData.map(function(d) {
          if(!isNaN(d.capacity))
              totalCap += +d.capacity;
      })

      //domain
      x.domain([data[0].state,data[1].state]);
      //y.domain([0, data[0].total]);
      y.domain([0,totalCap]);

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
          .text("Storage");

      var bar = svg.selectAll(".g")
        .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) {return "translate(" + x(d.state) + ",0)"; });

      bar.selectAll("rect")
          .data(function(d){return d.storages})
        .enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.y1); 
          })
          .attr("height", function(d) {return parseFloat(y(d.y0)) - parseFloat(y(d.y1)); })
          .style("fill", function(d) { return color(d.name); });

      // var legend = svg.selectAll(".legend")
      //     .data(data[0].storages)
      //   .enter().append("g")
      //     .attr("class", "legend")
      //     .attr("transform", function(d, i) { return "translate(0," + (height - (i * 20)) + ")"; });

      // legend.append("rect")
      //     .attr("x", width - 18)
      //     .attr("width", 18)
      //     .attr("height", 18)
      //     .style("fill", function(d) { return color(d.name); });

      // legend.append("text")
      //     .attr("x", width - 24)
      //     .attr("y", 9)
      //     .attr("dy", ".35em")
      //     .style("text-anchor", "start")
      //     .text(function(d) { return d.name; });
}