/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Logo generator for the dbm logo
 */
dbm.registerClass("dbm.dbmgraphics.graphicscreators.LogoGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.dbmgraphics.graphicscreators.LogoGenerator");
	
	//Self reference
	var LogoGenerator = dbm.importClass("dbm.dbmgraphics.graphicscreators.LogoGenerator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Generates 4 shapes to make up the logo.
	 *
	 * @return	Array<BezierCurve>	The array of curves.
	 */
	staticFunctions.createDbmLogo = function(aSideLength) {
		
		var dPath = BezierCurve.createWithLength(1, true, 4);
		var bPath = BezierCurve.createWithLength(1, true, 6);
		var mPath1 = BezierCurve.createWithLength(1, true, 4);
		var mPath2 = BezierCurve.createWithLength(1, true, 4);
		
		var returnArray = new Array(dPath, bPath, mPath1, mPath2);
		
		var singleSideLength = aSideLength/7;
		
		ClassReference.getTrianglePosition(0, 0, 0, singleSideLength, dPath.pointsArray[0]);
		ClassReference.getTrianglePosition(12, 0, 1, singleSideLength, dPath.pointsArray[1]);
		ClassReference.getTrianglePosition(0, 6, 2, singleSideLength, dPath.pointsArray[2]);
		ClassReference.getTrianglePosition(0, 0, 0, singleSideLength, dPath.pointsArray[3]);
		
		ClassReference.getTrianglePosition(0, 0, 0, singleSideLength, bPath.pointsArray[0]);
		ClassReference.getTrianglePosition(12, 0, 1, singleSideLength, bPath.pointsArray[1]);
		ClassReference.getTrianglePosition(4, 4, 1, singleSideLength, bPath.pointsArray[2]);
		ClassReference.getTrianglePosition(6, 0, 2, singleSideLength, bPath.pointsArray[3]);
		ClassReference.getTrianglePosition(0, 0, 2, singleSideLength, bPath.pointsArray[4]);
		ClassReference.getTrianglePosition(0, 0, 0, singleSideLength, bPath.pointsArray[5]);
		
		ClassReference.getTrianglePosition(2, 0, 0, singleSideLength, mPath1.pointsArray[0]);
		ClassReference.getTrianglePosition(4, 0, 1, singleSideLength, mPath1.pointsArray[1]);
		ClassReference.getTrianglePosition(2, 1, 2, singleSideLength, mPath1.pointsArray[2]);
		ClassReference.getTrianglePosition(2, 0, 0, singleSideLength, mPath1.pointsArray[3]);
		
		ClassReference.getTrianglePosition(8, 0, 0, singleSideLength, mPath2.pointsArray[0]);
		ClassReference.getTrianglePosition(10, 0, 1, singleSideLength, mPath2.pointsArray[1]);
		ClassReference.getTrianglePosition(8, 1, 2, singleSideLength, mPath2.pointsArray[2]);
		ClassReference.getTrianglePosition(8, 0, 0, singleSideLength, mPath2.pointsArray[3]);
		
		return returnArray;
	};
	
	staticFunctions.getTrianglePosition = function(aX, aY, aSideIndex, aSingleSideLength, aReturnPoint) {
		
		var multiplier = 1;
		var offset = 0;
		
		if(aX % 2 === 1) {
			aX--;
			aY++;
			multiplier = -1;
			offset = 1;
		}
		
		var singleHeight = aSingleSideLength*Math.sqrt(0.75);//METODO
		
		if(aSideIndex === 2) {
			aReturnPoint.x = (0.5*aX+0.5+0.5*aY)*aSingleSideLength;
			aReturnPoint.y = singleHeight*(aY+multiplier);
		}
		else {
			aReturnPoint.x = (0.5*aX+offset+aSideIndex*multiplier+0.5*aY)*aSingleSideLength;
			aReturnPoint.y = singleHeight*(aY);
		}
		console.log(aReturnPoint);
	};
});