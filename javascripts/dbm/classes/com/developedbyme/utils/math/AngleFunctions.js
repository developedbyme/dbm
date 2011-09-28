dbm.registerClass("com.developedbyme.utils.math.AngleFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.AngleFunctions");
	
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	staticFunctions.degreesToRadians = function(aDegrees) {
		return Math.PI*aDegrees/180;
	};
	
	staticFunctions.radiansToDegrees = function(aRadians) {
		return 180*aDegrees/Math.PI;
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
});