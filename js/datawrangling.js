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


Wrangling.usageDataWrang = function(_usageData, _dicData){
	var usageData = [];

	//filter by California
	filUsageData = _usageData.filter(function(d){ return d.STATE == "CA"})
	console.log("filterCA: ",filUsageData.length)

	//get neccesary column name
	var colList = [];
	var colLevel5 = []; //irrigation sprinkler etc
	_dicData.map(function(d){
		if(d.ColumnUse == "y")
			colList.push(d);
		if(d.ColumnUse == "s")
			colLevel5.push(d);
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
			//"indexOf"--search word in object, if find the word, return the place, if not, return "-1"
			//colList has many duplicate words and tmp object will get unique word, no duplicates.
			if(tmp.indexOf(d.Source) == -1 && d.Source != "")
				tmp.push(d.Source)
			if(tmp.indexOf(d.Type) == -1 && d.Type != "")
				tmp.push(d.Type)
			if(tmp.indexOf(d.Use) == -1 && d.Use != "")
				tmp.push(d.Use)
			if(tmp.indexOf(d.UseDetail) == -1 && d.UseDetail != "")
				tmp.push(d.UseDetail)
			if(tmp.indexOf(d.UseDetail2) == -1 && d.UseDetail2 != "")
				tmp.push(d.UseDetail2)
	})
	tmp.push("Sprinkler", "Micro Irrigation", "Surface Flood"); //for level 5

	//make nodes format for sankey 
	nodes = tmp.map(function(d){
		return {
			"name" : d
		};
	})
	console.log(nodes.length)

	//create Links
	var links = [];
	colList.map(function(d){

		//Level 1-2(source to type)
		var aggrFlg = false; 
		links.forEach(function(e){

			//aggregate when source and target are duplicate
			if(e.source == d.Source && e.target == d.Type){
				e.value += agUsageData[d.ColumnTag];
				aggrFlg = true;
			}
		})
		if(!aggrFlg && d.Source != "" && d.Type != ""){
			links.push({
				"source": d.Source,
				"target": d.Type,
				"value": (d.Source.substring(0,3) != "N/A" && d.Type.substring(0,3) != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}

		//Level 2-3(type to use)
		aggrFlg = false; //initialize flag
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
				"value":  (d.Type.substring(0,3) != "N/A" && d.Use.substring(0,3) != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}

		//Level 3-4(use to use detail)
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
				"value":  (d.Use.substring(0,3) != "N/A" && d.UseDetail.substring(0,3) != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}
		//Level 4-5(use detail to use detail2)
		if(!aggrFlg && d.UseDetail != "" && d.UseDetail2 != ""){
			links.push({
				"source": d.UseDetail,
				"target": d.UseDetail2 ,
				"value":  (d.UseDetail.substring(0,3) != "N/A" && d.UseDetail2.substring(0,3) != "N/A") ? agUsageData[d.ColumnTag] : 1
			})
		}

	})

	//ColumnUse="s" only

	colLevel5.forEach(function(d){
		links.push({
			"source": d.UseDetail,
			"target": d.UseDetail2,
			"value": agUsageData[d.ColumnTag]
		})
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





           	










