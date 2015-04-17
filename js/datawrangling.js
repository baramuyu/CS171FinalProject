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





           	










