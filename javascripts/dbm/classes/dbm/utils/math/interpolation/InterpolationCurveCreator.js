/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Curve creator for interpolations.
 */
dbm.registerClass("dbm.utils.math.interpolation.InterpolationCurveCreator", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.interpolation.InterpolationCurveCreator");
	
	var InterpolationCurveCreator = dbm.importClass("dbm.utils.math.interpolation.InterpolationCurveCreator");
	
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	staticFunctions.createCurveFromInterpolation = function(aInterpolationObject, aNumberOfSteps, aX0, aY0, aX1, aY1) {
		
		aNumberOfSteps = VariableAliases.valueWithDefault(aNumberOfSteps, 100);
		aX0 = VariableAliases.valueWithDefault(aX0, 0);
		aY0 = VariableAliases.valueWithDefault(aY0, 0);
		aX1 = VariableAliases.valueWithDefault(aX1, 1);
		aY1 = VariableAliases.valueWithDefault(aY1, 1);
		
		var returnCurve = BezierCurve.createWithLength(1, true, aNumberOfSteps+1);
		
		for(var i = 0; i <= aNumberOfSteps; i++) {
			var currentParameter = i/aNumberOfSteps;
			var interpolatedParameter = aInterpolationObject.interpolate(currentParameter);
			var newX = (1-currentParameter)*aX0+(currentParameter)*aX1;
			var newY = (1-interpolatedParameter)*aY0+(interpolatedParameter)*aY1;
			returnCurve.pointsArray[i].x = newX;
			returnCurve.pointsArray[i].y = newY;
		}
		
		return returnCurve;
	};
});