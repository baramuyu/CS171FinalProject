Wrangling = function(){
}

Wrangling.resDataWrang = function(_resData){
	var resData = [];
	var dateFormatter = d3.time.format("%Y%m%d"); // see: https://github.com/mboresck/d3/wiki/Time-Formatting

    _resData.forEach(function(d){

    	stoData = [];
		for (var date in d.Storage ) {
			stoData.push({
				date: dateFormatter.parse(date),
				storage: d.Storage[date]
			})
		}

    	resData.push({
    			name: d.Station,
    			values: stoData
    	})
    })
    console.log("RESDATA",resData)
    return resData
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




