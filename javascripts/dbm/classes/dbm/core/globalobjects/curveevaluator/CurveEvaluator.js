/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Global class that evaluates curves.
 */
dbm.registerClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	
	var CurveEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CreateBezierCurveFromPoints2d = dbm.importClass("dbm.core.globalobjects.curveevaluator.creators.CreateBezierCurveFromPoints2d");
	var CreateMultiSegmentBezierCurveFromPoints2d = dbm.importClass("dbm.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var ExtrapolationTypes = dbm.importClass("dbm.constants.ExtrapolationTypes");
	
	
	staticFunctions.DEFAULT_EXACTNESS = 0.01;
		
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator::_init");
		
		//METODO: switch this to qualifiers instead of interface
		this._evaluatorsArray = new Array();
		this._bezierMultipliersArraysArray = new Array();
		this._recyclePointsArray = new Array();
		
		return this;
	};
	
	objectFunctions.addEvaluator = function(aEvaluator) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator::addEvaluator");
		//console.log(aEvaluator);
		this._evaluatorsArray.push(aEvaluator);
	};
	
	objectFunctions.getPartOfCurve = function(aPointSet, aStartParameter, aEndParameter, aExactness, aReturnCurve) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator::getPartOfCurve");
		//console.log(aPointSet, this._evaluatorsArray);
		
		var isForward = (aEndParameter >= aStartParameter);
		
		var currentArray = this._evaluatorsArray;
		var currentArrayLength = currentArray.length;
		for (var i = 0; i < currentArrayLength; i++) {
			var currentEvaluator = currentArray[i];
			if(currentEvaluator.canEvaluate(aPointSet)) {
				if(isForward) {
					currentEvaluator.getPartOfCurve(aPointSet, aStartParameter, aEndParameter, aExactness, aReturnCurve);
				}
				else {
					currentEvaluator.getPartOfCurve(aPointSet, aEndParameter, aStartParameter, aExactness, aReturnCurve);
					//aReturnCurve; //METODO: reverse
				}
				return;
			}
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getPartOfCurve", aPointSet + " can't be evaluated.");
		return;
	};
	
	objectFunctions.getPointOnBezierSegment3d = function(aPointsArray, aParameter, aOutputPoint) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator::getPointOnBezierSegment3d");
		//console.log(aPointsArray, aParameter, aOutputPoint);
		var curveDegree = aPointsArray.length-1;
		var multipliersArray = this.getBezierMultipliersArray(curveDegree);
		var invertedParameter = (1-aParameter);
		var newXValue = 0;
		var newYValue = 0;
		var newZValue = 0;
		var currentArray = aPointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			var currentPoint = currentArray[i];
			var currentMultiplicationValue = multipliersArray[i]*Math.pow(invertedParameter, curveDegree-i)*Math.pow(aParameter, i);
			newXValue += currentMultiplicationValue*currentPoint.x;
			newYValue += currentMultiplicationValue*currentPoint.y;
			newZValue += currentMultiplicationValue*currentPoint.z;
		}
		aOutputPoint.x = newXValue;
		aOutputPoint.y = newYValue;
		aOutputPoint.z = newZValue;
	};
	
	objectFunctions.getPointOnBezierSegment2d = function(aPointsArray, aParameter, aOutputPoint) {
		var curveDegree = aPointsArray.length-1;
		var multipliersArray = this.getBezierMultipliersArray(curveDegree);
		var invertedParameter = (1-aParameter);
		var newXValue = 0;
		var newYValue = 0;
		var currentArray = aPointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			var currentPoint = currentArray[i];
			var currentMultiplicationValue = multipliersArray[i]*Math.pow(invertedParameter, curveDegree-i)*Math.pow(aParameter, i);
			newXValue += currentMultiplicationValue*currentPoint.x;
			newYValue += currentMultiplicationValue*currentPoint.y;
		}
		aOutputPoint.x = newXValue;
		aOutputPoint.y = newYValue;
	};
	
	objectFunctions.getTangentOnBezierSegment2d = function(aPointsArray, aParameter, aOutputPoint) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator.getTangentOnBezierSegment2d");
		
		var curveDegree = aPointsArray.length-1;
		
		var constantsX = new Array(curveDegree+1);
		var constantsY = new Array(curveDegree+1);
		for(var i = 0; i < curveDegree+1; i++) {
			constantsX[i] = 0;
			constantsY[i] = 0;
		}
		
		var basicMultipliersArray = this.getBezierMultipliersArray(curveDegree);
		var currentArray = aPointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			var currentPoint = currentArray[i];
			var multipliersArray = this.getBezierMultipliersArray(curveDegree-i);
			
			var negativeMultiplier = 1;
			for(var j = 0; j < multipliersArray.length; j++) {
				constantsX[j+i] += (currentPoint.x)*negativeMultiplier*basicMultipliersArray[i]*multipliersArray[j];
				constantsY[j+i] += (currentPoint.y)*negativeMultiplier*basicMultipliersArray[i]*multipliersArray[j];
				negativeMultiplier = 0-negativeMultiplier;
			}
		}
		
		//METODO: multiply all values so that they have the value that is correct after derivation
		for(var i = -1; ++i < curveDegree+1;) {
			constantsX[i] *= i;
			constantsY[i] *= i;
		}
		
		//MENOTE: the first value is ignored since it is always 0
		//MENOTE: the second value is set as the initial value since it is a constant after derivation
		var newXValue = constantsX[1];
		var newYValue = constantsY[1];
		
		for(var i = 1; ++i < curveDegree+1;) {
			newXValue += constantsX[i]*Math.pow(aParameter, i-1);
			newYValue += constantsY[i]*Math.pow(aParameter, i-1);
		}
		
		aOutputPoint.x = newXValue;
		aOutputPoint.y = newYValue;
	};
	
	objectFunctions.getBezierMultipliersArray = function(aCurveDegree) {
		//MENOTE: generates constants for cv-points
		var currentArray = this._bezierMultipliersArraysArray;
		var previousArray = currentArray[currentArray.length-1];
		for(var i = currentArray.length-1; ++i <= aCurveDegree;) {
			var newArray = new Array(i+1);
			newArray[0] = 1;
			newArray[i] = 1;
			for(var j = 0; ++j < newArray.length-1;) {
				newArray[j] = previousArray[j-1]+previousArray[j];
			}
			currentArray.push(newArray);
			previousArray = newArray;
		}
		return currentArray[aCurveDegree];
	};
	
	/**
	 * Calculates the berstein polynominal for a parameter
	 *
	 * @param	aParameter	The parameter (Valid range: 0 to 1).
	 * @param	aPointNr	The point of the curve.
	 * @param	aDegree		The curve degree.
	 */
	objectFunctions.calculateBernsteinPolynomialWithoutMultiplier = function(aParameter, aPointNr, aDegree) {
		//console.log("calculateBernsteinPolynomialWithoutMultiplier");
		return Math.pow((1-aParameter), (aDegree-aPointNr))*Math.pow(aParameter, aPointNr);
	};
	
	objectFunctions._evaluateAnimationCurveSegment = function(aPointsArray, aSegment, aEvaluationValue, aExactness) {
		var point1 = aPointsArray[4*aSegment];
		var point2 = aPointsArray[4*aSegment+1];
		var point3 = aPointsArray[4*aSegment+2];
		var point4 = aPointsArray[4*aSegment+3];
		if(aEvaluationValue === point1.x) {
			return point1.y;
		}
		else if(aEvaluationValue === point4.x) {
			return point4.y;
		}
		else {
			var minValue = point1.x;
			var maxValue = point4.x;
			var minParameter = 0;
			var maxParameter = 1;
			var currentXValue = aEvaluationValue-point1.x;
			var debugLoopCounter = 0;
			var currentParameter;
			while(true) {
				if(debugLoopCounter++ > 200) {
					//METODO: error message
					break;
				}
				currentParameter = (maxParameter-minParameter)*(aEvaluationValue-minValue)/(maxValue-minValue)+minParameter;
				var currentXValue = (Math.pow(1-currentParameter, 3)*point1.x+3*(Math.pow(1-currentParameter, 2))*(currentParameter)*point2.x+3*(Math.pow(currentParameter, 2))*(1-currentParameter)*point3.x+Math.pow(currentParameter, 3)*point4.x);
				if(Math.abs(currentXValue-aEvaluationValue) < this.exactness) {
					break;
				}
				else {
					if(currentXValue < aEvaluationValue) {
						minValue = currentXValue;
						minParameter = currentParameter;
					}
					else {
						maxValue = currentXValue;
						maxParameter = currentParameter;
					}
				}
			}
			return (Math.pow(1-currentParameter, 3)*point1.y+3*(Math.pow(1-currentParameter, 2))*(currentParameter)*point2.y+3*(Math.pow(currentParameter, 2))*(1-currentParameter)*point3.y+Math.pow(currentParameter, 3)*point4.y);
		}
	};
	
	objectFunctions.getValueOfAnimationCurve = function(aCurve, aParameter, aPreInfinityMethod, aPostInfinityMethod, aExactness) {
		aPreInfinityMethod = VariableAliases.valueWithDefault(aPreInfinityMethod, ExtrapolationTypes.CONSTANT);
		aPostInfinityMethod = VariableAliases.valueWithDefault(aPostInfinityMethod, ExtrapolationTypes.CONSTANT);
		aExactness = VariableAliases.valueWithDefault(aExactness, ClassReference.DEFAULT_EXACTNESS);
		var currentArray = aCurve.pointsArray;
		var curveLength = currentArray[currentArray.length-1].x-currentArray[0].x;
		var offset = Math.floor((aParameter-currentArray[0].x)/(curveLength));
		var evaluationParameter = (aParameter-currentArray[0].x)-(offset*curveLength);
		if(offset < 0) {
			switch(aPreInfinityMethod) {
				case ExtrapolationTypes.CONSTANT:
					return currentArray[0].y;
				case ExtrapolationTypes.OSCILLATE:
					//METODO
				case ExtrapolationTypes.LINEAR:
					//METODO
				default:
					//METODO: error message
					break;
			}
			
		}
		else if(offset > 0) {
			switch(aPostInfinityMethod) {
				case ExtrapolationTypes.CONSTANT:
					return currentArray[currentArray.length-1].y;
				case ExtrapolationTypes.OSCILLATE:
					//METODO
				case ExtrapolationTypes.LINEAR:
					//METODO
				default:
					//METODO: error message
					break;
			}
			
		}
		
		var currentSegmentNumber = 0;
		var outputValueOffset = 0;
		if(offset < 0) {
			switch(aPreInfinityMethod) {
				case ExtrapolationTypes.CYCLE:
					//MENOTE: do nothing
					break;
				case ExtrapolationTypes.CYCLE_WITH_OFFSET:
					outputValueOffset = offset*(currentArray[currentArray.length-1].y-currentArray[0].y);
					break;
				default:
					//METODO: error message
					break;
			}
		}
		if(offset > 0) {
			switch(aPostInfinityMethod) {
				case ExtrapolationTypes.CYCLE:
					//MENOTE: do nothing
					break;
				case ExtrapolationTypes.CYCLE_WITH_OFFSET:
					outputValueOffset = offset*(currentArray[currentArray.length-1].y-currentArray[0].y);
					break;
				default:
					//METODO: error message
					break;
			}
		}
		var currentSegmentNr = 0;
		while(true) {
			if((evaluationParameter >= currentArray[4*currentSegmentNr].x) && (evaluationParameter < currentArray[4*currentSegmentNr+3].x)) {
				return this._evaluateAnimationCurveSegment(currentArray, currentSegmentNumber, evaluationParameter, aExactness)+outputValueOffset;
			}
			else if(evaluationParameter < currentArray[4*currentSegmentNr].x) {
				currentSegmentNr--;
			}
			else if(evaluationParameter >= currentArray[4*currentSegmentNr+3].x) {
				currentSegmentNr++;
			}
			else {
				//METODO: error message
				break;
			}
		}
	};
	
	/**
	 * Creates a bezier curve that passes through a set of points
	 *
	 * @param	aPointsArray	The points that the current curve should pass through.
	 * @param	aReturnCurve	The curve that is created.
	 */
	objectFunctions.createBezierCurveFromPoints3d = function(aPointsArray, aReturnCurve) {
		//console.log("createBezierCurveFromPoints3d");
		var curveDegree = aPointsArray.length-1;
		var multipliersArray = this.getBezierMultipliersArray(curveDegree);
		
		var arrayLength = aPointsArray.length-2;
		
		var startPoint = aPointsArray[0];
		var endPoint = aPointsArray[aPointsArray.length-1];
		
		var eliminationArray = new Array(arrayLength);
		var currentArray = eliminationArray;
		var theLength = currentArray.length;
		for(var i = -1; ++i < theLength;) {
			var currentArray2 = new Array(arrayLength+3);
			currentArray[i] = currentArray2;
			var parameter = (i+1)/(curveDegree);
			for(var j = -1; ++j < arrayLength;) {
				currentArray2[j] = multipliersArray[j+1]*this.calculateBernsteinPolynomialWithoutMultiplier(parameter, j+1, curveDegree);
			}
			
			var startBpValue = Math.pow((1-parameter), curveDegree);
			var endBpValue = Math.pow(parameter, curveDegree);
			var currentPoint = aPointsArray[i+1];
			currentArray2[arrayLength+0] = currentPoint.x-startBpValue*startPoint.x-endBpValue*endPoint.x;
			currentArray2[arrayLength+1] = currentPoint.y-startBpValue*startPoint.y-endBpValue*endPoint.y;
			currentArray2[arrayLength+2] = currentPoint.z-startBpValue*startPoint.z-endBpValue*endPoint.z;
		}
		
		for(var i = 0; ++i < arrayLength;) {
			//MENOTE: no elimination on first row
			var currentEliminationArray = eliminationArray[i];
			var currentDataArray = eliminationArray[i];
			var currentRemoveArray;
			for(var j = -1; ++j < i;) {
				currentRemoveArray = eliminationArray[j];
				var multiplier = currentDataArray[j]/currentRemoveArray[j];
				for(var k = -1; ++k < currentEliminationArray.length;) {
					currentEliminationArray[k] = currentDataArray[k] - multiplier*currentRemoveArray[k];
				}
				currentEliminationArray[j] = 0;
			}
		}
		
		for(var i = arrayLength; --i >= 0;) {
			for(var j = arrayLength; --j > i;) {
				var rowMultiplier = eliminationArray[i][j];
				eliminationArray[i][arrayLength+0] = eliminationArray[i][arrayLength+0]-rowMultiplier*eliminationArray[j][arrayLength+0];
				eliminationArray[i][arrayLength+1] = eliminationArray[i][arrayLength+1]-rowMultiplier*eliminationArray[j][arrayLength+1];
				eliminationArray[i][arrayLength+2] = eliminationArray[i][arrayLength+2]-rowMultiplier*eliminationArray[j][arrayLength+2];
				eliminationArray[i][j] = 0;
			}
			var rowMultiplier = eliminationArray[i][i];
			eliminationArray[i][i] = 1;
			eliminationArray[i][arrayLength+0] /= rowMultiplier;
			eliminationArray[i][arrayLength+1] /= rowMultiplier;
			eliminationArray[i][arrayLength+2] /= rowMultiplier;
			var currentPoint = aReturnCurve.pointsArray[i+1];
			currentPoint.x = eliminationArray[i][arrayLength+0];
			currentPoint.y = eliminationArray[i][arrayLength+1];
			currentPoint.z = eliminationArray[i][arrayLength+2];
		}
	};
	
	/**
	 * Creates a bezier curve that passes through a set of points
	 *
	 * @param	aPointsArray	The points that the current curve should pass through.
	 * @param	aReturnCurve	The curve that is created.
	 * @param	aParameters		The array with parameters for the different points.
	 */
	objectFunctions.createBezierCurveFromPoints2d = function(aPointsArray, aReturnCurve, aParametersArray) {
		
		var curveCreator = (new CreateBezierCurveFromPoints2d()).init();
		curveCreator.createCurve(aPointsArray, aReturnCurve, aParametersArray);
	};
	
	/**
	 * Creates a multisegment bezier curve that passes through a set of points
	 *
	 * @param	aPointsArray	The points that the current curve should pass through.
	 * @param	aReturnCurve	The curve that is created.
	 */
	objectFunctions.createMultiSegmentBezierCurveFromPoints2d = function(aPointsArray, aReturnCurve, aIsRound) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator.createMultiSegmentBezierCurveFromPoints2d");
		if(aReturnCurve.getCurveDegree() !== 3) {
			//METODO
			//return;
		}
		
		var curveCreator = (new CreateMultiSegmentBezierCurveFromPoints2d()).init();
		curveCreator.createCurve(aPointsArray, aReturnCurve, aIsRound);
		
	};
	
	objectFunctions.recycleCurve = function(aCurve) {
		//console.log("dbm.core.globalobjects.curveevaluator.CurveEvaluator::recycleCurve");
		
		this._recyclePointsArray.push(aCurve.pointsArray);
	};
});