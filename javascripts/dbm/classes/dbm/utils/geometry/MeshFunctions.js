/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.geometry.MeshFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.geometry.MeshFunctions");
	
	//Self reference
	var MeshFunctions = dbm.importClass("dbm.utils.geometry.MeshFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.getMaxPoint2d = function(aPointsArray, aAngle) {
		
		var returnIndex = -1;
		var maxValue = NaN;
		
		var sinValue = Math.sin(aAngle);
		var cosValue = Math.cos(aAngle);
		
		var currentArray = aPointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			var xValue = currentPoint.x*cosValue+currentPoint.y*sinValue;
			if(returnIndex === -1 || xValue > maxValue) {
				maxValue = xValue;
				returnIndex = i;
			}
		}
		
		return returnIndex;
	};
});