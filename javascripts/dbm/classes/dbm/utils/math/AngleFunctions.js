/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for working with angles.
 */
dbm.registerClass("dbm.utils.math.AngleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.AngleFunctions");
	//"use strict";
	
	//Self reference
	var AngleFunctions = dbm.importClass("dbm.utils.math.AngleFunctions");
	
	/**
	 * Converts degrees to radians.
	 *
	 * @param	aDegrees	Number	The degrees to convert.
	 *
	 * @return	Number	The radians that corresponds to the degrees.
	 */
	staticFunctions.degreesToRadians = function(aDegrees) {
		return Math.PI*aDegrees/180;
	};
	
	staticFunctions.radiansToDegrees = function(aRadians) {
		return 180*aRadians/Math.PI;
	};
	
	staticFunctions.normalizeAngle = function(aAngle) {
		var times = Math.floor((aAngle+Math.PI)/(2*Math.PI));
		return (aAngle-(times*2*Math.PI));
	};
	
	staticFunctions.angleIsInNormalizedRange = function(aAngle, aMinAngle, aMaxAngle) {
		if(aMinAngle > aMaxAngle) {
			return !(aAngle > aMaxAngle && aAngle < aMinAngle);
		}
		else {
			return (aAngle <= aMaxAngle && aAngle >= aMinAngle);
		}
	};
	
	staticFunctions.getAngleForPolygon = function(aSides) {
		if(aSides < 2) {
			return NaN;
		}
		
		var flooredSides = Math.floor(aSides);
		var parameter = aSides-flooredSides;
		
		var flooredAngle = 2*Math.PI/flooredSides;
		var ceiledAngle = 2*Math.PI/(flooredSides+1);
		
		return (1-parameter)*flooredAngle+parameter*ceiledAngle;
	};
	
	staticFunctions.angleDifference = function(aAngle1, aAngle2) {
		//console.log("dbm.utils.math.AngleFunctions::angleDifference");
		aAngle1 = ClassReference.normalizeAngle(aAngle1);
		aAngle2 = ClassReference.normalizeAngle(aAngle2);
		
		if(Math.abs(aAngle1-aAngle2) > Math.PI) {
			if(aAngle1 > aAngle2) {
				return aAngle1-(aAngle2+2*Math.PI);
			}
			return aAngle1-(aAngle2-2*Math.PI);
		}
		else {
			return aAngle1-aAngle2;
		}
	};
	
	staticFunctions.degreeDifference = function(aAngle1, aAngle2) {
		return ClassReference.radiansToDegrees(ClassReference.angleDifference(ClassReference.degreesToRadians(aAngle1), ClassReference.degreesToRadians(aAngle2)));
	};
	
	staticFunctions.atanh = function(aValue) {
		return 0.5*Math.log((1+aValue)/(1-aValue));
	};
	
	staticFunctions.sinh = function(aValue) {
		return 0.5*(Math.exp(aValue)-Math.exp(-1*aValue));
	};
	
	staticFunctions.cosh = function(aValue) {
		return 0.5*(Math.exp(aValue)+Math.exp(-1*aValue));
	};
});