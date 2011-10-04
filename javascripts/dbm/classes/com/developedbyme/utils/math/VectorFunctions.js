dbm.registerClass("com.developedbyme.utils.math.VectorFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.VectorFunctions");
	
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	
	staticFunctions.normalize2d = function(aInputPoint, aOutputPoint) {
		var invertedLength = 1/Math.sqrt(Math.pow(aInputPoint.x, 2)+Math.pow(aInputPoint.y, 2));
		aOutputPoint.x = invertedLength*aInputPoint.x;
		aOutputPoint.y = invertedLength*aInputPoint.y;
	};
	
	staticFunctions.normalizeSelf2d = function(aPoint) {
		ClassReference.normalize2d(aPoint, aPoint);
	};
	
	staticFunctions.dotProduct2d = function(aPoint1, aPoint2) {
		return (aPoint1.x*aPoint2.x)+(aPoint1.y*aPoint2.y);
	};
	
	staticFunctions.crossProduct2d = function(aInputPoint1, aInputPoint2, aOutputPoint) {
		var x1 = aInputPoint1.x;
		var y1 = aInputPoint1.y;
		
		var x2 = aInputPoint2.x;
		var y2 = aInputPoint2.y;
		
		aOutputPoint.x = 0;
		aOutputPoint.y = 0;
		aOutputPoint.z = (x1*y2)-(y1*x2);
	};	
	
	staticFunctions.normalize3d = function(aInputPoint, aOutputPoint) {
		var invertedLength = 1/Math.sqrt(Math.pow(aInputPoint.x, 2)+Math.pow(aInputPoint.y, 2)+Math.pow(aInputPoint.z, 2));
		aOutputPoint.x = invertedLength*aInputPoint.x;
		aOutputPoint.y = invertedLength*aInputPoint.y;
		aOutputPoint.z = invertedLength*aInputPoint.z;
	};
	
	staticFunctions.normalizeSelf3d = function(aPoint) {
		ClassReference.normalize3d(aPoint, aPoint);
	};
	
	staticFunctions.dotProduct3d = function(aPoint1, aPoint2) {
		return (aPoint1.x*aPoint2.x)+(aPoint1.y*aPoint2.y)+(aPoint1.z*aPoint2.z);
	};
	
	staticFunctions.crossProduct3d = function(aInputPoint1, aInputPoint2, aOutputPoint) {
		var x1 = aInputPoint1.x;
		var y1 = aInputPoint1.y;
		var z1 = aInputPoint1.z;
		
		var x2 = aInputPoint2.x;
		var y2 = aInputPoint2.y;
		var z2 = aInputPoint2.z;
		
		aOutputPoint.x = (y1*z2)-(z1*y2);
		aOutputPoint.y = (z1*x2)-(x1*z2);
		aOutputPoint.z = (x1*y2)-(y1*x2);
	};
	
	staticFunctions.angleFromVector = function(aVector) {
		return Math.atan2(aVector.y, aVector.x);
	};
	
	staticFunctions.angleFromVectorValues = function(aX, aY) {
		return Math.atan2(aY, aX);
	};
});