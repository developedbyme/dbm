/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.AngleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.AngleFunctions");
	//"use strict";
	
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
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
});