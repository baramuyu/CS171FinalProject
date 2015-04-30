Wrangling = function(){
}

Wrangling.resDataWrang = function(_resData){
	var resData = [];

    _resData.forEach(function(d){

    	stoData = [];
		for (var date in d.Storage ) {
			stoData.push({
				date: date,
				storage: d.Storage[date]
			})
		}

    	resData.push({
    			name: d.Station,
                capacity: d.Capacity,
                latitude: d.Latitude,
                longitude: d.Longitude,
    			values: stoData
    	})
    })
    console.log("RESDATA",resData)

    this.saveToFile(resData,"reservoirDataForMultiLine.json")

    return resData
}

<<<<<<< HEAD
=======

Wrangling.usageDataWrang = function(_usageData, _dicData){
	var usageData = [];

	//filter by California
	filUsageData = _usageData.filter(function(d){ return d.STATE == "CA"})
	console.log("filterCA: ",filUsageData.length)

	//get neccesary column name
	var colList = [];
	_dicData.map(function(d){
		if(d.Source != "")
			colList.push(d);
	})

	//aggregate by all county
	var agUsageData = {}; 
	filUsageData.map(function(d){
		for (var column in d) {
			if(!isNaN(+d[column]) && column != "STATE" && column != "COUNTY"){

				if(agUsageData[column]==undefined)	
					agUsageData[column] = 0;
			
				agUsageData[column] += +d[column];
			}
		}
	})

	//create Nodes
	var nodes = [];
	var tmp = [];
	colList.map(function(d){
		if(tmp.indexOf(d.Source) == -1)
			tmp.push(d.Source)
		if(tmp.indexOf(d.Type) == -1)
			tmp.push(d.Type)
		if(tmp.indexOf(d.Use) == -1)
			tmp.push(d.Use)
	})
	nodes = tmp.map(function(d){
		return{
			"name" : d
		};
	})
	console.log(nodes.length)

	//create Links
	var links = [];
	colList.map(function(d){
		links.push({
			"source": d.Source,
			"target": d.Type ,
			"value": agUsageData[d.ColumnTag]
		})
		links.push({
			"source": d.Type,
			"target": d.Use ,
			"value": agUsageData[d.ColumnTag]
		})
	})
	console.log(links.length)

	var result = 
		{
			"nodes": nodes,
			"links": links
		};

	console.log(result)

	//Export files
	//this.saveToFile(agUsageData,"aggregatedUsageData.json")
	//this.saveToFile(colList,"dictionaryData.json")
	//this.saveToFile(result,"sankeyData.json")

	return result;
}



Wrangling.saveToFile = function(object, filename){
    var blob, blobText;
    blobText = [JSON.stringify(object, null, '\t')];
    blob = new Blob(blobText, {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename);

    console.log("finish!")
}


>>>>>>> 23e96fea2d98a6eea75d4d49ab209f641451c22b

Wrangling.usageDataWrang = function(_usageData, _dicData){
	var usageData = [];

	//filter by California
	filUsageData = _usageData.filter(function(d){ return d.STATE == "CA"})
	console.log("filterCA: ",filUsageData.length)

	//get neccesary column name
	var colList = [];
	_dicData.map(function(d){
		if(d.ColumnUse == "y")
			colList.push(d);
	})

	//aggregate by all county
	var agUsageData = {}; 
	filUsageData.map(function(d){
		for (var column in d) {
			if(!isNaN(+d[column]) && column != "STATE" && column != "COUNTY"){

				if(agUsageData[column]==undefined)	
					agUsageData[column] = 0;
			
				agUsageData[column] += +d[column];
			}
		}
	})

	//create Nodes
	var nodes = [];
	var tmp = [];
	colList.map(function(d){
			if(tmp.indexOf(d.Source) == -1)
				tmp.push(d.Source)
			if(tmp.indexOf(d.Type) == -1)
				tmp.push(d.Type)
			if(tmp.indexOf(d.Use) == -1)
				tmp.push(d.Use)
			if(tmp.indexOf(d.UseDetail) == -1 && d.UseDetail != "")
				tmp.push(d.UseDetail)
			// if(tmp.indexOf(d.UseDetail2) == -1)
			// 	tmp.push(d.UseDetail2)
	})
	nodes = tmp.map(function(d){
		return {
			"name" : d
		};
	})
	console.log(nodes.length)

	//create Links
	var links = [];
	colList.map(function(d){
		var aggrFlg = false; 
		links.forEach(function(e){
			if(e.source == d.Source && e.target == d.Type){
				e.value += agUsageData[d.ColumnTag];
				aggrFlg = true;
			}
		})
		if(!aggrFlg && d.Source != "" && d.Type != ""){
			links.push({
				"source": d.Source,
				"target": d.Type,
				"value": (d.Source != "N/A" && d.Type != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}
		aggrFlg = false; //initialize
		links.forEach(function(e){
			if(e.source == d.Type && e.target == d.Use){
				e.value += agUsageData[d.ColumnTag];
				aggrFlg = true;
			}
		})
		if(!aggrFlg && d.Type != "" && d.Use != ""){
			links.push({
				"source": d.Type,
				"target": d.Use ,
				"value":  (d.Type != "N/A" && d.Use != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}
		aggrFlg = false; //initialize
		links.forEach(function(e){
			if(e.source == d.Use && e.target == d.UseDetail){
				e.value += agUsageData[d.ColumnTag];
				aggrFlg = true;
			}
		})
		if(!aggrFlg && d.Use != "" && d.UseDetail != ""){
			links.push({
				"source": d.Use,
				"target": d.UseDetail ,
				"value":  (d.Use != "N/A" && d.UseDetail != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}

<<<<<<< HEAD
	})
	console.log(links.length)

	var result = 
		{
			"nodes": nodes,
			"links": links
		};


	nodes.forEach(function(d){
		console.log(d.name)
	})
	links.forEach(function(d){
		console.log(d.source,"/",d.target,d.value)
	})
	

	//Export files
	//this.saveToFile(agUsageData,"aggregatedUsageData.json")
	//this.saveToFile(colList,"dictionaryData.json")
	//this.saveToFile(result,"sankeyData.json")
=======
>>>>>>> 23e96fea2d98a6eea75d4d49ab209f641451c22b

	return result;
}



Wrangling.saveToFile = function(object, filename){
    var blob, blobText;
    blobText = [JSON.stringify(object, null, '\t')];
    blob = new Blob(blobText, {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename);

    console.log("finish!")
}





           	

<<<<<<< HEAD









=======
>>>>>>> 23e96fea2d98a6eea75d4d49ab209f641451c22b
