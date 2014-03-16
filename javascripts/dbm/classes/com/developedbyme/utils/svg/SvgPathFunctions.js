/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.svg.SvgPathFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.svg.SvgPathFunctions");
	//"use strict";
	
	var SvgPathFunctions = dbm.importClass("com.developedbyme.utils.svg.SvgPathFunctions");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var ParseFunctions = dbm.importClass("com.developedbyme.utils.native.string.ParseFunctions");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	var SvgPathCommandTypes = dbm.importClass("com.developedbyme.constants.SvgPathCommandTypes");
	
	staticFunctions._TYPE_NOTHING = 0;
	staticFunctions._TYPE_COMMAND = 1;
	staticFunctions._TYPE_VALUE = 2;
	
	staticFunctions.createCurveFromPathString = function(aPathString) {
		var commandsArray = new Array();
		
		var degree = ClassReference.splitUpPathString(aPathString, commandsArray);
		console.log(degree);
		console.log(commandsArray);
		
		var moveRelativeIndex = ArrayFunctions.lastIndexOfInArray(commandsArray, SvgPathCommandTypes.MOVE_TO_RELATIVE);
		var moveIndex = ArrayFunctions.lastIndexOfInArray(commandsArray, SvgPathCommandTypes.MOVE_TO);
		var lastMoveIndex = (moveRelativeIndex !== -1) ? ((moveIndex !== -1) ? Math.max(moveRelativeIndex, moveIndex) : moveRelativeIndex) : moveIndex;
		
		var isCompact = (lastMoveIndex <= 0);
		
		var returnCurve = BezierCurve.create(degree, isCompact);
		
		var tempSegment = new Array(degree);
		for(var i = 0; i < degree; i++) {
			tempSegment[i] = Point.create();
		}
		var lastTempSegmentDegree = 0;
		var lastPoint = null;
		var lastPoint2 = null;
		lastPoint = returnCurve.createPoint(0, 0);
		
		var currentCommand = null;
		var currentArray = commandsArray;
		var currentArrayLength = currentArray.length;
		var debugCounter = 0;
		for(var i = 0; i < currentArrayLength; i) { //i is incremented in the loop
			if(debugCounter++ > 1000) {
				//METODO error message
				return null;
			}
			var currentValue = currentArray[i];
			if(typeof(currentValue) === JavascriptObjectTypes.TYPE_STRING) {
				currentCommand = currentValue;
				i++;
			}
			var shouldAddExtra = !isCompact;
			switch(currentCommand) {
				case SvgPathCommandTypes.MOVE_TO:
					lastPoint.x = currentArray[i++];
					lastPoint.y = currentArray[i++];
					shouldAddExtra = false;
					break;
				case SvgPathCommandTypes.MOVE_TO_RELATIVE:
					lastPoint.x += currentArray[i++];
					lastPoint.y += currentArray[i++];
					shouldAddExtra = false;
					break;
				case SvgPathCommandTypes.ARC_TO:
				case SvgPathCommandTypes.ARC_TO_RELATIVE:
					//METODO: implement arcs
					i += 5;
					break;
				default:
					var newSegment = returnCurve.createCompactSegment();
					var relativeX = 0;
					var relativeY = 0;
					var addShorthandInput = false;
					var fillInputSegment = false;
					var iIncrement = 0;
					var newLastTempSegmentDegree = 0;
					var newLength = 0;
					var returnOffset = 0;
					
					switch(currentCommand) {
						case SvgPathCommandTypes.CUBIC_CURVE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.CUBIC_CURVE_TO:
							newLastTempSegmentDegree = 3;
							newLength = 3;
							returnOffset = 0;
							fillInputSegment = true;
							iIncrement = 6;
							break;
						case SvgPathCommandTypes.SHORTHAND_CUBIC_CURVE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.SHORTHAND_CUBIC_CURVE_TO:
							addShorthandInput = true;
							newLastTempSegmentDegree = 3;
							newLength = 2;
							returnOffset = 1;
							fillInputSegment = true;
							iIncrement = 4;
							break;
						case SvgPathCommandTypes.QUADRATIC_CURVE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.QUADRATIC_CURVE_TO:
							newLastTempSegmentDegree = 2;
							newLength = 2;
							returnOffset = 0;
							fillInputSegment = true;
							iIncrement = 4;
							break;
						case SvgPathCommandTypes.SHORTHAND_QUADRATIC_CURVE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.SHORTHAND_QUADRATIC_CURVE_TO:
							addShorthandInput = true;
							newLastTempSegmentDegree = 2;
							newLength = 1;
							returnOffset = 1;
							fillInputSegment = true;
							iIncrement = 2;
							break;
						case SvgPathCommandTypes.LINE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.LINE_TO:
							newLastTempSegmentDegree = 1;
							newLength = 1;
							returnOffset = 0;
							fillInputSegment = true;
							iIncrement = 2;
							break;
						case SvgPathCommandTypes.HORIZONTAL_LINE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.HORIZONTAL_LINE_TO:
							newLastTempSegmentDegree = 1;
							tempSegment[0].x = relativeX+currentArray[i];
							tempSegment[0].y = lastPoint.y;
							iIncrement = 1;
							break;
						case SvgPathCommandTypes.VERTICAL_LINE_TO_RELATIVE:
							relativeX = lastPoint.x;
							relativeY = lastPoint.y;
						case SvgPathCommandTypes.VERTICAL_LINE_TO:
							newLastTempSegmentDegree = 1;
							tempSegment[0].x = lastPoint.x;
							tempSegment[0].y = relativeY+currentArray[i];
							iIncrement = 1;
							break;
						case SvgPathCommandTypes.CLOSE_PATH:
						case SvgPathCommandTypes.CLOSE_PATH_RELATIVE:
							newLastTempSegmentDegree = 1;
							tempSegment[0].x = returnCurve.pointsArray[0].x;
							tempSegment[0].y =  returnCurve.pointsArray[0].y;
							//MENOTE: do not increase i
							break;
						default:
							//METODO: error message
							return null;
					}
					
					if(addShorthandInput) {
						ClassReference._setShorthandInput(lastPoint, lastPoint2, lastTempSegmentDegree, tempSegment);
					}
					lastTempSegmentDegree = newLastTempSegmentDegree;
					if(fillInputSegment) {
						ClassReference._fillInputSegment(currentArray, i, newLength, relativeX, relativeY, returnOffset, tempSegment);
					}
					ClassReference._setupSegment(lastPoint, lastTempSegmentDegree, degree, tempSegment, newSegment);
					i += iIncrement;
					
					lastPoint2 = lastPoint;
					lastPoint = newSegment[newSegment.length-1];
					break;
			}
			
			if(shouldAddExtra && i < currentArrayLength) {
				lastPoint = returnCurve.createPoint(lastPoint.x, lastPoint.y);
			}
		}
		
		return returnCurve;
	};
	
	staticFunctions._fillInputSegment = function(aDataArray, aPosition, aLength, aRelativeX, aRelativeY, aReturnOffset, aReturnSegment) {
		for(var i = 0; i < aLength; i++) {
			aReturnSegment[aReturnOffset+i].x = aRelativeX+aDataArray[aPosition+2*i];
			aReturnSegment[aReturnOffset+i].y = aRelativeY+aDataArray[aPosition+2*i+1];
		}
	};
	
	staticFunctions._setupSegment = function(aLastPoint, aInputDegree, aOutputDegree, aInputSegment, aReturnSegment) {
		if(aInputDegree === aOutputDegree) {
			for(var i = 0; i < aOutputDegree; i++) {
				aReturnSegment[i].x = aInputSegment[i].x;
				aReturnSegment[i].y = aInputSegment[i].y;
			}
		}
		else {
			dbm.singletons.dbmCurveCreator.createHigherDegreeCompactSegment(aLastPoint, aInputDegree, aOutputDegree, aInputSegment, aReturnSegment);
		}
	};
	
	staticFunctions.splitUpPathString = function(aPathString, aReturnArray) {
		
		aPathString = StringFunctions.trim(aPathString);
		var returnDegree = 1;
		var theLength = aPathString.length;
		
		var debugCounter = 0;
		for(var i = 0; i < theLength;) { //MENOTE: i is incremented in the loop
			if(debugCounter++ > 1000) {
				//METODO error message
				return -1;
			}
			var currentChar = aPathString.charAt(i);
			
			switch(currentChar) {
				case SvgPathCommandTypes.CUBIC_CURVE_TO:
				case SvgPathCommandTypes.CUBIC_CURVE_TO_RELATIVE:
				case SvgPathCommandTypes.SHORTHAND_CUBIC_CURVE_TO:
				case SvgPathCommandTypes.SHORTHAND_CUBIC_CURVE_TO_RELATIVE:
					returnDegree = 3;
					aReturnArray.push(currentChar);
					i++;
					break;
				case SvgPathCommandTypes.QUADRATIC_CURVE_TO:
				case SvgPathCommandTypes.QUADRATIC_CURVE_TO_RELATIVE:
				case SvgPathCommandTypes.SHORTHAND_QUADRATIC_CURVE_TO:
				case SvgPathCommandTypes.SHORTHAND_QUADRATIC_CURVE_TO_RELATIVE:
				case SvgPathCommandTypes.ARC_TO:
				case SvgPathCommandTypes.ARC_TO_RELATIVE:
					returnDegree = Math.max(2, returnDegree);
					aReturnArray.push(currentChar);
					i++;
					break;
				case SvgPathCommandTypes.MOVE_TO:
				case SvgPathCommandTypes.MOVE_TO_RELATIVE:
				case SvgPathCommandTypes.LINE_TO:
				case SvgPathCommandTypes.LINE_TO_RELATIVE:
				case SvgPathCommandTypes.HORIZONTAL_LINE_TO:
				case SvgPathCommandTypes.HORIZONTAL_LINE_TO_RELATIVE:
				case SvgPathCommandTypes.VERTICAL_LINE_TO:
				case SvgPathCommandTypes.VERTICAL_LINE_TO_RELATIVE:
				case SvgPathCommandTypes.CLOSE_PATH:
				case SvgPathCommandTypes.CLOSE_PATH_RELATIVE:
					aReturnArray.push(currentChar);
					i++;
					break;
				default:
					var numberEnd = ParseFunctions.getEndOfNumber(aPathString, i);
					var currentNumber = aPathString.substring(i, numberEnd);
					aReturnArray.push(parseFloat(currentNumber));
					i = numberEnd;
					break;
			}
			
			i = ParseFunctions.getEndOfSpacer(aPathString, i, ",");
		}
		
		return returnDegree;
	};
	
	staticFunctions.createDefinitionForCurve = function(aCurve) {
		var returnString = SvgPathCommandTypes.MOVE_TO + aCurve.pointsArray[0].x + "," + aCurve.pointsArray[0].y;
		var curveType = SvgPathCommandTypes.LINE_TO;
		var numberOfPointsPerStep = aCurve.getCurveDegree();
		switch(numberOfPointsPerStep) {
			case 3:
				var curveType = SvgPathCommandTypes.CUBIC_CURVE_TO;
				break;
			case 2:
				var curveType = SvgPathCommandTypes.QUADRATIC_CURVE_TO;
				break;
			case 1:
				var curveType = SvgPathCommandTypes.LINE_TO;
				break;
		}
		var isCompact = aCurve.isCompact();
		
		returnString += curveType;
		
		var currentArray = aCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i += numberOfPointsPerStep) {
			if(i !== 1) {
				if(isCompact) {
					returnString += " ";
				}
				else {
					returnString += SvgPathCommandTypes.MOVE_TO + aCurve.pointsArray[i].x + "," + aCurve.pointsArray[i].y + curveType;
					i++;
				}
			}
			returnString += aCurve.pointsArray[i].x + "," + aCurve.pointsArray[i].y;
			for(var j = 1; j < numberOfPointsPerStep; j++) {
				returnString += " " + aCurve.pointsArray[i+j].x + "," + aCurve.pointsArray[i+j].y;
			}
		}
		
		return returnString;
	};
	
	staticFunctions.drawCurveToPath = function(aPathElement, aCurve) {
		aPathElement.pathSegList.appendItem(aPathElement.createSVGPathSegMovetoAbs(aCurve.pointsArray[0].x, aCurve.pointsArray[0].y));
		var numberOfPointsPerStep = aCurve.getCurveDegree();
		var isCompact = aCurve.isCompact();
		
		var currentArray = aCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i += numberOfPointsPerStep) {
			if(i !== 1) {
				if(!isCompact) {
					aPathElement.pathSegList.appendItem(aPathElement.createSVGPathSegMovetoAbs(aCurve.pointsArray[i].x, aCurve.pointsArray[i].y));
					i++;
				}
			}
			switch(numberOfPointsPerStep) {
				case 1:
					
					aPathElement.pathSegList.appendItem(aPathElement.createSVGPathSegLinetoAbs(aCurve.pointsArray[i].x, aCurve.pointsArray[i].y));
					break;
				case 2:
					aPathElement.pathSegList.appendItem(aPathElement.createSVGPathSegCurvetoQuadraticAbs(aCurve.pointsArray[i+1].x, aCurve.pointsArray[i+1].y, aCurve.pointsArray[i].x, aCurve.pointsArray[i].y));
					break;
				case 3:
					aPathElement.pathSegList.appendItem(aPathElement.createSVGPathSegCurvetoCubicAbs( aCurve.pointsArray[i+2].x, aCurve.pointsArray[i+2].y, aCurve.pointsArray[i].x, aCurve.pointsArray[i].y, aCurve.pointsArray[i+1].x, aCurve.pointsArray[i+1].y));
					break;
			}
		}
	};
});