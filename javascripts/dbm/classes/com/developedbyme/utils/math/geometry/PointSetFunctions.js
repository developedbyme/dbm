/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for maniplulating point sets.
 */
dbm.registerClass("com.developedbyme.utils.math.geometry.PointSetFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.geometry.PointSetFunctions");
	
	//Self reference
	var PointSetFunctions = dbm.importClass("com.developedbyme.utils.math.geometry.PointSetFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Utils
	
	//Constants
	
	/**
	 * Gets the average point in an array of points.
	 * 
	 * @param	aPoints			Array<Point>	The array of points to get the average of.
	 * @param	aReturnPoint	Point			The point where the average value is set to.
	 */
	staticFunctions.getAveragePoint = function(aPoints, aReturnPoint) {
		aReturnPoint.x = 0;
		aReturnPoint.y = 0;
		aReturnPoint.z = 0;
		
		var currentArray = aPoints;
		var currentArrayLength = currentArray.length;
		var multiplier = 1/currentArrayLength;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			aReturnPoint.x += multiplier*currentPoint.x;
			aReturnPoint.y += multiplier*currentPoint.y;
			aReturnPoint.z += multiplier*currentPoint.z;
		}
	};
	
	/**
	 * Sets random positions (in 2d) to points in an array.
	 *
	 * @param	aPoints				Array<Point>		The array of points to set random values to.
	 * @param	aMinX				Number				The smallest x value that the points can be set to. (Optional, default 0)
	 * @param	aMinY				Number				The smallest y value that the points can be set to. (Optional, default 0)
	 * @param	aMaxX				Number				The largest x value that the points can be set to. (Optional, default 1)
	 * @param	aMaxY				Number				The largest y value that the points can be set to. (Optional, default 1)
	 * @param	aRandomGenerator	MersenneTwister		The random generator to generate positions with.
	 */
	staticFunctions.setRandomPositions2d = function(aPoints, aMinX, aMinY, aMaxX, aMaxY, aRandomGenerator) {
		
		var lengthX = aMaxX-aMinX;
		var lengthY = aMaxY-aMinY;
		
		var currentArray = aPoints;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			
			currentPoint.x = lengthX*aRandomGenerator.generateRealClosedOpen()+aMinX;
			currentPoint.y = lengthY*aRandomGenerator.generateRealClosedOpen()+aMinY;
		}
	};
	
});