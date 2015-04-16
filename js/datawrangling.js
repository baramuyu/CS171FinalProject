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

Wrangling.saveToFile = function(object, filename){
    var blob, blobText;
    blobText = [JSON.stringify(object, null, '\t')];
    blob = new Blob(blobText, {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, filename);

    console.log("finish!")
}




    //     for (var date in resData) {
    //       if (resData.hasOwnProperty(date)) {
    //         // console.log('this is resrage (' + date + ') for sure. Value: ' + resData[date]);

    //         var perdayData = {
    //         	date: dateFormatter.parse(date),
    //             value: parseInt(resData[date]) //resrage in reservoir
    //         }

    //         var StationData = {
    //         	name: d.Station,
    //             values: perdayData
    //         };

    //         resData.push(StationData);

    //       }
    //     }
    // })
    // return resData;

           	











            //     var resData = d.resrage

            //     for (var date in resData) {
            //       if (resData.hasOwnProperty(date)) {
            //         // console.log('this is resrage (' + date + ') for sure. Value: ' + resData[date]);

            //         var tmp = {
            //             date: dateFormatter.parse(date),
            //             name: d.Station,
            //             value: parseInt(resData[date]) //resrage in reservoir
            //         };

            //         resData.push(tmp);

            //       }
            //     }
            //     return true;
            // })




