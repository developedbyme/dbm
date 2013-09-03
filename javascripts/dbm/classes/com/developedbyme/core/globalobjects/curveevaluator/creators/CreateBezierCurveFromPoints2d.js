/**
 * Creates curve that passes through a set of points.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateBezierCurveFromPoints2d", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateBezierCurveFromPoints2d");
	
	var EquationSolver = dbm.importClass("com.developedbyme.utils.math.EquationSolver");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateBezierCurveFromPoints2d");
		
		this.superCall();
		
		return this;
	} //End function CreateBezierCurveFromPoints2d
	
	/**
	 * Creates the curve.
	 *
	 * @param	aPointsArray	The points that defines how the curve should be created.
	 * @param	aReturnCurve	The curve that gets the new values.
	 * @param	aParameters		The array with parameters for the different points.
	 */
	objectFunctions.createCurve = function(aPointsArray, aReturnCurve, aParameters) {
		var curveDegree = aPointsArray.length-1;
		var multipliersArray = dbm.singletons.dbmCurveEvaluator.getBezierMultipliersArray(curveDegree);
		
		var arrayLength = aPointsArray.length;
		
		var eliminationArray = new Array(arrayLength);
		var currentArray = eliminationArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			var currentArray2 = new Array(arrayLength+2);
			currentArray[i] = currentArray2;
			var parameter = aParameters[i];
			for(var j = 0; j < arrayLength; j++) {
				currentArray2[j] = multipliersArray[j]*dbm.singletons.dbmCurveEvaluator.calculateBernsteinPolynomialWithoutMultiplier(parameter, j, curveDegree);
			}
			
			var startBpValue = Math.pow((1-parameter), curveDegree);
			var endBpValue = Math.pow(parameter, curveDegree);
			var currentPoint = aPointsArray[i];
			currentArray2[arrayLength+0] = currentPoint.x;
			currentArray2[arrayLength+1] = currentPoint.y;
		}
		
		EquationSolver.solveEquation(eliminationArray);
		
		for(var i = 0; i < theLength; i++) {
			var currentPoint = aReturnCurve.pointsArray[i];
			var currentArray2 = eliminationArray[i];
			currentPoint.x = currentArray2[arrayLength+0];
			currentPoint.y = currentArray2[arrayLength+1];
		}
	};
});