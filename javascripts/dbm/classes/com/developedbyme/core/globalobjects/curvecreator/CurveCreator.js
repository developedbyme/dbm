/**
 * Global class that create curves
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.curvecreator.CurveCreator", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curvecreator.CurveCreator");
	//"use strict";
	
	var CurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.CurveCreator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var QuadricEquationSolver = dbm.importClass("com.developedbyme.utils.math.QuadricEquationSolver");
	
	var CurveMergeTypes = dbm.importClass("com.developedbyme.constants.CurveMergeTypes");
	var ExtrapolationTypes = dbm.importClass("com.developedbyme.constants.ExtrapolationTypes");
	
	dbm.setClassAsSingleton("dbmCurveCreator");
	
	staticFunctions.DEFAULT_EXACTNESS = 0.01;
		
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curvecreator.CurveCreator");
		
		return this;
	};
	
	objectFunctions.createPolygon = function(aNumberOfSegments, aLength, aStartAngle) {
		
		aStartAngle = VariableAliases.valueWithDefault(aStartAngle, 0);
		
		var newCurve = BezierCurve.createWithLength(1, true, aNumberOfSegments);
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentParameter = i/(currentArrayLength);
			var currentPoint = currentArray[i];
			currentPoint.x = aLength*Math.cos(2*Math.PI*currentParameter+aStartAngle);
			currentPoint.y = aLength*Math.sin(2*Math.PI*currentParameter+aStartAngle);
		}
		
		return newCurve;
	};
	
	objectFunctions.createStar = function(aNumberOfSegments, aLengths, aStartAngle) {
		
		aStartAngle = VariableAliases.valueWithDefault(aStartAngle, 0);
		
		var newCurve = BezierCurve.createWithLength(1, true, aLengths.length*aNumberOfSegments);
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentParameter = i/(currentArrayLength);
			var currentPoint = currentArray[i];
			var currentLength = aLengths[i%aLengths.length];
			currentPoint.x = currentLength*Math.cos(2*Math.PI*currentParameter+aStartAngle);
			currentPoint.y = currentLength*Math.sin(2*Math.PI*currentParameter+aStartAngle);
		}
		
		return newCurve;
	};
		
	objectFunctions.createSmoothStar = function(aNumberOfSegments, aDegree, aLengths, aStartAngle) {
		
		aStartAngle = VariableAliases.valueWithDefault(aStartAngle, 0);
		
		var numberOfInternalSegments = (aLengths.length)/(aDegree);
		if(numberOfInternalSegments !== Math.floor(numberOfInternalSegments)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "createSmoothStar", "Internal segnments length " + (aLengths.length) + " doesn't fit curve degree (" + aDegree + ").");
			return null;
		}
		
		var newCurve = BezierCurve.createWithLength(aDegree, true, numberOfInternalSegments*aNumberOfSegments);
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentParameter = i/(currentArrayLength-1);
			var currentPoint = currentArray[i];
			var currentLength = aLengths[i%aLengths.length];
			currentPoint.x = currentLength*Math.cos(2*Math.PI*currentParameter+aStartAngle);
			currentPoint.y = currentLength*Math.sin(2*Math.PI*currentParameter+aStartAngle);
		}
		
		return newCurve;
	};
	
	objectFunctions.createRectangle = function(aX, aY, aWidth, aHeight) {
		//console.log("com.developedbyme.core.globalobjects.curvecreator.CurveCreator::createRectangle");
		
		var newCurve = BezierCurve.createWithLength(1, true, 5);
		
		var currentArray = newCurve.pointsArray;
		currentArray[0].x = aX;
		currentArray[0].y = aY;
		currentArray[1].x = aX+aWidth;
		currentArray[1].y = aY;
		currentArray[2].x = aX+aWidth;
		currentArray[2].y = aY+aHeight;
		currentArray[3].x = aX;
		currentArray[3].y = aY+aHeight;
		currentArray[4].x = aX;
		currentArray[4].y = aY;
		
		return newCurve;
	};
	
	objectFunctions.createCircle = function(aX, aY, aRadius, aNumberOfSegments, aStartAngle) {
		//console.log("com.developedbyme.core.globalobjects.curvecreator.CurveCreator::createCircle");
		
		aNumberOfSegments = VariableAliases.valueWithDefault(aNumberOfSegments, 8);
		aStartAngle = VariableAliases.valueWithDefault(aStartAngle, 0);
		
		var newCurve = BezierCurve.createWithLength(3, true, 3*aNumberOfSegments+1);
		
		var centerAngle = 2*Math.PI/(aNumberOfSegments);
		var sideLength = 2*aRadius*Math.sin(0.5*centerAngle);
		var extendLength = 0.5*(sideLength)/Math.cos(0.5*centerAngle);
		var anchorLength = QuadricEquationSolver.solveEquation(1, -4*extendLength, 2*Math.pow(extendLength, 2)).solution1;
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		
		currentArray[0].x = aX+aRadius*Math.cos(aStartAngle);
		currentArray[0].y = aY+aRadius*Math.sin(aStartAngle);
		
		var lastParameter = 0;
		
		for(var i = 1; i <= aNumberOfSegments; i++) {
			var currentParameter = 2*i/(aNumberOfSegments);
			
			currentArray[3*i-2].x = aX+aRadius*Math.cos(aStartAngle+Math.PI*lastParameter)+anchorLength*Math.cos(0.5*Math.PI+(aStartAngle+Math.PI*lastParameter));
			currentArray[3*i-2].y = aY+aRadius*Math.sin(aStartAngle+Math.PI*lastParameter)+anchorLength*Math.sin(0.5*Math.PI+(aStartAngle+Math.PI*lastParameter));
			
			currentArray[3*i-1].x = aX+aRadius*Math.cos(aStartAngle+Math.PI*currentParameter)-anchorLength*Math.cos(0.5*Math.PI+(aStartAngle+Math.PI*currentParameter));
			currentArray[3*i-1].y = aY+aRadius*Math.sin(aStartAngle+Math.PI*currentParameter)-anchorLength*Math.sin(0.5*Math.PI+(aStartAngle+Math.PI*currentParameter));
			
			currentArray[3*i].x = aX+aRadius*Math.cos(aStartAngle+Math.PI*currentParameter);
			currentArray[3*i].y = aY+aRadius*Math.sin(aStartAngle+Math.PI*currentParameter);
			lastParameter = currentParameter;
		}
		
		return newCurve;
	};
		
	objectFunctions.createCurveFromSeparatedString = function(aDegree, aIsCompact, aValueString, aSeparator) {
			
		var separator = VariableAliases.valueWithDefault(aSeparator, ",");
		
		var valuesArray = aValueString.split(separator);
		
		return this.createCurveFromValuesArray(aDegree, aIsCompact, valuesArray);
	};
		
	objectFunctions.createCurveFromValuesArray = function(aDegree, aIsCompact, aValuesArray) {
		
		var valuesArray = aValuesArray;
		var numberOfPoints = 0.5*valuesArray.length;
		
		var newCurve = BezierCurve.createWithLength(aDegree, aIsCompact, numberOfPoints);
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			currentPoint.x = parseFloat(valuesArray[2*i]);
			currentPoint.y = parseFloat(valuesArray[2*i+1]);
		}
		
		return newCurve;
	};
		
	objectFunctions.createCurveFromDoubleSeparatedString = function(aDegree, aIsCompact, aValueString, aFirstSeparator, aSecondSeparator) {
			
		var firstSeparator = VariableAliases.valueWithDefault(aFirstSeparator, ";");
		var secondSeparator = VariableAliases.valueWithDefault(aSecondSeparator, ",");
		
		var valuesArray = aValueString.split(firstSeparator);
		var numberOfPoints = valuesArray.length;
		
		var newCurve = BezierCurve.createWithLength(aDegree, aIsCompact, numberOfPoints);
		
		var currentArray = newCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			var tempArray = valuesArray[i].split(secondSeparator);
			currentPoint.x = parseFloat(tempArray[0]);
			currentPoint.y = parseFloat(tempArray[1]);
		}
		
		return newCurve;
	};
	
	objectFunctions.createGrid = function(aX, aY, aWidth, aHeight, aNumberOfHorizontalSegments, aNumberOfVerticalSegments, aHorizontalReturnArray, aVerticalReturnArray) {
		
		for(var i = 0; i < aNumberOfVerticalSegments+1; i++) {
			var newHorizontalLine = BezierCurve.createWithLength(1, true, aNumberOfHorizontalSegments+1);
			aHorizontalReturnArray[i] = newHorizontalLine;
			var yPosition = aY+(aHeight*(i/aNumberOfVerticalSegments));
			for(var j = 0; j < aNumberOfHorizontalSegments+1; j++) {
				newHorizontalLine.pointsArray[j].x = aX+(aWidth*(j/aNumberOfHorizontalSegments));
				newHorizontalLine.pointsArray[j].y = yPosition;
			}
		}
		
		for(var i = 0; i < aNumberOfHorizontalSegments+1; i++) {
			var newVerticalLine = BezierCurve.createWithLength(1, true, aNumberOfVerticalSegments+1);
			aVerticalReturnArray[i] = newVerticalLine;
			var xPosition = aX+(aWidth*(i/aNumberOfHorizontalSegments));
			for(var j = 0; j < aNumberOfVerticalSegments+1; j++) {
				newVerticalLine.pointsArray[j].x = xPosition;
				newVerticalLine.pointsArray[j].y = aY+(aHeight*(j/aNumberOfVerticalSegments));
			}
		}
	};
	
	objectFunctions._createOneDegreeHigherCompactSegment = function(aLastPoint, aCurrentDegree, aInputSegment, aOutputSegment) {
		var lastX = aLastPoint.x;
		var lastY = aLastPoint.y;
		var lastZ = aLastPoint.z;
		
		aOutputSegment[aCurrentDegree].x = aInputSegment[aCurrentDegree-1].x;
		aOutputSegment[aCurrentDegree].y = aInputSegment[aCurrentDegree-1].y;
		aOutputSegment[aCurrentDegree].z = aInputSegment[aCurrentDegree-1].z;
		
		for(var i = 0; i < aCurrentDegree; i++) {
			var calculationParameter = (i+1)/(aCurrentDegree+1);
			var currentX = aInputSegment[i].x;
			var currentY = aInputSegment[i].y;
			var currentZ = aInputSegment[i].z;
			aOutputSegment[i].x = (calculationParameter)*lastX+(1-calculationParameter)*currentX;
			aOutputSegment[i].y = (calculationParameter)*lastY+(1-calculationParameter)*currentY;
			aOutputSegment[i].z = (calculationParameter)*lastZ+(1-calculationParameter)*currentZ;
			lastX = currentX;
			lastY = currentY;
			lastZ = currentZ;
		}
		
	};
	
	objectFunctions.createHigherDegreeCompactSegment = function(aLastPoint, aInputDegree, aOutputDegree, aInputSegment, aReturnSegment) {
		
		if(aInputDegree === aOutputDegree) {
			for(var i = 0; i < aOutputDegree; i++) {
				aReturnSegment[i].x = aInputSegment[i].x;
				aReturnSegment[i].y = aInputSegment[i].y;
				aReturnSegment[i].z = aInputSegment[i].z;
			}
		}
		else if(aInputDegree === 1) {
			for(var i = 1; i < aOutputDegree+1; i++) {
				var parameter = i/aOutputDegree;
				aReturnSegment[i-1].x = (1-parameter)*aLastPoint.x+parameter*aInputSegment[0].x;
				aReturnSegment[i-1].y = (1-parameter)*aLastPoint.y+parameter*aInputSegment[0].y;
				aReturnSegment[i-1].z = (1-parameter)*aLastPoint.z+parameter*aInputSegment[0].z;
			}
		}
		else {
			this._createOneDegreeHigherCompactSegment(aLastPoint, aInputDegree, aInputSegment, aReturnSegment);
			for(var i = aInputDegree+1; i < aOutputDegree; i++) {
				this._createOneDegreeHigherCompactSegment(aLastPoint, i, aReturnSegment, aReturnSegment);
			}
		}
	};
	
	objectFunctions.combineCurves = function(aCurve1, aCurve2, aMergeType) {
		var curve1Degree = aCurve1.getCurveDegree();
		var curve2Degree = aCurve2.getCurveDegree();
		var maxDegree = Math.max(curve1Degree, curve2Degree);
		var curve1IsCompact = aCurve1.isCompact();
		var curve2IsCompact = aCurve2.isCompact();
		var isCompact = curve1IsCompact && curve2IsCompact;
		
		var startPosition1 = (curve1IsCompact) ? 1 : 0;
		var stepLength1 = (curve1IsCompact) ? curve1Degree : (curve1Degree+1);
		var startPosition2 = (curve2IsCompact) ? 1 : 0;
		var stepLength2 = (curve2IsCompact) ? curve2Degree : (curve2Degree+1);
		
		var curve1NumberOfSegments = aCurve1.getNumberOfSegments();
		var curve2NumberOfSegments = aCurve2.getNumberOfSegments();
		var newCurveLength = curve1NumberOfSegments+curve2NumberOfSegments;
		
		switch(aMergeType) {
			case CurveMergeTypes.NON_COMPACT:
			case CurveMergeTypes.POINT_MERGE:
				//MENOTE: do nothing
				break;
			case CurveMergeTypes.LINEAR_CONNECT:
			case CurveMergeTypes.TANGENT_CURVE_CONNECT:
				newCurveLength++;
				break;
		}
		
		var numberOfPoints = (isCompact) ? 1+newCurveLength*maxDegree : newCurveLength*(maxDegree+1);
		
		var tempSegment = new Array(maxDegree);
		var returnSegment = new Array(maxDegree);
		
		var returnCurve = BezierCurve.createWithLength(maxDegree, isCompact, numberOfPoints);
		
		var currentOutputSegmentNumber = 0;
		var lastPoint = returnCurve.pointsArray[0];
		
		lastPoint.x = aCurve1.pointsArray[0].x;
		lastPoint.y = aCurve1.pointsArray[0].y;
		lastPoint.z = aCurve1.pointsArray[0].z;
		
		for(var i = 0; i < curve1NumberOfSegments; i++) {
			if(!isCompact && i !== 0) {
				Point.copyPoint3d(aCurve1.getSegmentStartPoint(i), lastPoint);
			}
			aCurve1.getCompactSegment(i, tempSegment);
			returnCurve.getCompactSegment(currentOutputSegmentNumber, returnSegment);
			this.createHigherDegreeCompactSegment(lastPoint, curve1Degree, maxDegree, tempSegment, returnSegment);
			currentOutputSegmentNumber++;
			lastPoint = returnCurve.getSegmentStartPoint(currentOutputSegmentNumber);
		}
		
		switch(aMergeType) {
			case CurveMergeTypes.NON_COMPACT:
			case CurveMergeTypes.POINT_MERGE:
				//MENOTE: do nothing
				break;
			case CurveMergeTypes.LINEAR_CONNECT:
				//METODO
				currentOutputSegmentNumber++;
				break;
			case CurveMergeTypes.TANGENT_CURVE_CONNECT:
				//METODO
				currentOutputSegmentNumber++;
				break;
		}
		
		for(var i = 0; i < curve2NumberOfSegments; i++) {
			if(!isCompact) {
				Point.copyPoint3d(aCurve2.getSegmentStartPoint(i), lastPoint);
			}
			aCurve2.getCompactSegment(i, tempSegment);
			returnCurve.getCompactSegment(currentOutputSegmentNumber, returnSegment);
			this.createHigherDegreeCompactSegment(lastPoint, curve2Degree, maxDegree, tempSegment, returnSegment);
			currentOutputSegmentNumber++;
			lastPoint = returnCurve.getSegmentStartPoint(currentOutputSegmentNumber);
		}
		
		return returnCurve;
	};
});