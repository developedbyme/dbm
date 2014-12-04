/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.VectorFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.VectorFunctions");
	
	//Self reference
	var VectorFunctions = dbm.importClass("dbm.utils.math.VectorFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.add2d = function(aInputPoint1, aInputPoint2, aOutputPoint) {
		aOutputPoint.x = aInputPoint1.x+aInputPoint2.x;
		aOutputPoint.y = aInputPoint1.y+aInputPoint2.y;
	};
	
	staticFunctions.multiply2d = function(aMultiplier, aInputPoint, aOutputPoint) {
		aOutputPoint.x = aMultiplier*aInputPoint.x;
		aOutputPoint.y = aMultiplier*aInputPoint.y;
	};
	
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
	
	staticFunctions.add3d = function(aInputPoint1, aInputPoint2, aOutputPoint) {
		aOutputPoint.x = aInputPoint1.x+aInputPoint2.x;
		aOutputPoint.y = aInputPoint1.y+aInputPoint2.y;
		aOutputPoint.z = aInputPoint1.z+aInputPoint2.z;
	};
	
	staticFunctions.multiply3d = function(aMultiplier, aInputPoint, aOutputPoint) {
		aOutputPoint.x = aMultiplier*aInputPoint.x;
		aOutputPoint.y = aMultiplier*aInputPoint.y;
		aOutputPoint.z = aMultiplier*aInputPoint.z;
	};
	
	staticFunctions.normalize3d = function(aInputPoint, aOutputPoint) {
		console.log("dbm.utils.math.VectorFunctions::normalize3d");
		console.log(aInputPoint, aOutputPoint);
		var invertedLength = 1/Math.sqrt(Math.pow(aInputPoint.x, 2)+Math.pow(aInputPoint.y, 2)+Math.pow(aInputPoint.z, 2));
		aOutputPoint.x = invertedLength*aInputPoint.x;
		aOutputPoint.y = invertedLength*aInputPoint.y;
		aOutputPoint.z = invertedLength*aInputPoint.z;
	};
	
	staticFunctions.normalizeSelf3d = function(aPoint) {
		console.log("dbm.utils.math.VectorFunctions::normalizeSelf3d");
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
	
	staticFunctions.lengthFromVector = function(aVector) {
		//console.log("dbm.utils.math.VectorFunctions::lengthFromVector (static)");
		//console.log(aVector.x, aVector.y, aVector.z);
		return ClassReference.lengthFromVectorValues3d(aVector.x, aVector.y, aVector.z);
	};
	
	staticFunctions.lengthFromVectorValues2d = function(aX, aY) {
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2));
	};
	
	staticFunctions.lengthFromVectorValues3d = function(aX, aY, aZ) {
		//console.log("dbm.utils.math.VectorFunctions::lengthFromVectorValues3d (static)");
		//console.log(aX, aY, aZ);
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2)+Math.pow(aZ, 2));
	};
});