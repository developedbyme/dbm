/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Legacy logo that generates 3 lines to make up the dbm mountain.
 */
dbm.registerClass("dbm.dbmgraphics.graphicscreators.LegacyLineLogoGenerator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.dbmgraphics.graphicscreators.LegacyLineLogoGenerator");
	
	//Self reference
	var LegacyLineLogoGenerator = dbm.importClass("dbm.dbmgraphics.graphicscreators.LegacyLineLogoGenerator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Generates 3 lines to make up the logo.
	 *
	 * @param	aWidth			Number	The width of the logo.
	 * @param	aHeightRatio	Number	The ratio between the height and the width.
	 * @param	aSpaceToBRatio	Number	The ratio between the b and the d.
	 *
	 * @return	Array<BezierCurve>	The array of curves.
	 */
	staticFunctions.createDbmLogo = function(aWidth, aHeightRatio, aSpaceToBRatio) {
		
		var dPath = BezierCurve.createWithLength(1, true, 4);
		var bPath = BezierCurve.createWithLength(1, true, 4);
		var mPath = BezierCurve.createWithLength(1, true, 6);
		
		var returnArray = new Array(dPath, bPath, mPath);
		
		var hypotenuseLength = Math.sqrt(Math.pow(0.5*aWidth, 2)+Math.pow(aHeightRatio*aWidth, 2));
		var space = (0.5*aWidth)/((2+(0.5/aSpaceToBRatio))*hypotenuseLength/(aHeightRatio*aWidth)+1/aHeightRatio);
		var spaceWidth = space*hypotenuseLength/(aHeightRatio*aWidth);
		var bHalfLength = (0.5/aSpaceToBRatio)*spaceWidth;
		
		var centerX = 0.5*aWidth;
		var doubleRatio = 2*aHeightRatio;
		
		dPath.pointsArray[0].setValues(0, 0);
		dPath.pointsArray[1].setValues(aWidth, 0);
		dPath.pointsArray[2].setValues(centerX, doubleRatio*centerX);
		dPath.pointsArray[3].setValues(space/doubleRatio, space);
		
		var bBaseLine = 2*space;
		var peakCenterLength = 0.5*bHalfLength;
		
		bPath.pointsArray[0].setValues(centerX-bHalfLength, bBaseLine);
		bPath.pointsArray[1].setValues(centerX+bHalfLength, bBaseLine);
		bPath.pointsArray[2].setValues(centerX+peakCenterLength, bBaseLine+doubleRatio*0.5*bHalfLength);
		bPath.pointsArray[3].setValues(centerX+space/doubleRatio, bBaseLine+space);
		
		var mBaseLine = space;
		var mHalfLength = bHalfLength+spaceWidth+space/doubleRatio;
		var mPeakHalfWidth = (mHalfLength-peakCenterLength);
		var mHeight = doubleRatio*mPeakHalfWidth;
		
		var crossAngle = 2*Math.atan(1/doubleRatio);
		var crossLength = space/Math.sin(crossAngle);
		var firstPeakParameter = crossLength/Math.sqrt(Math.pow(peakCenterLength, 2)+Math.pow(doubleRatio*peakCenterLength, 2));
		
		mPath.pointsArray[0].setValues(centerX-firstPeakParameter*peakCenterLength, mBaseLine+mHeight-(doubleRatio*((1-firstPeakParameter)*peakCenterLength)));
		mPath.pointsArray[1].setValues(centerX-peakCenterLength, mBaseLine+mHeight);
		mPath.pointsArray[2].setValues(centerX-mHalfLength, mBaseLine);
		mPath.pointsArray[3].setValues(centerX+mHalfLength, mBaseLine);
		mPath.pointsArray[4].setValues(centerX+peakCenterLength, mBaseLine+mHeight);
		mPath.pointsArray[5].setValues(centerX+mHalfLength-2*mPeakHalfWidth+((2*space)/doubleRatio), mBaseLine+2*space);
		
		return returnArray;
	};
	
	/**
	 * To get sharp horizontal lines (with withd 0) they need to be on 0.5 pixels. This functions adjusts all the poinrts to the rounded y value + 0.5.
	 *
	 * @param	aPointsArray	Array<Point>	The array of points that should be edited.
	 */
	staticFunctions.sharpUpLines = function(aPointsArray) {
		var currentArray = aPointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			currentPoint.y = Math.round(currentPoint.y)+0.5;
		}
	};
});