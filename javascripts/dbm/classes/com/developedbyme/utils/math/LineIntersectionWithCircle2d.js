/**
 * Class for determin where two lines collide.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.2.01
 */
dbm.registerClass("com.developedbyme.utils.math.LineIntersectionWithCircle2d", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.LineIntersectionWithCircle2d");
	
	var LineIntersectionWithCircle2d = dbm.importClass("com.developedbyme.utils.math.LineIntersectionWithCircle2d");
	
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	staticFunctions._tempLineIntersection = null;
	staticFunctions._tempVector = null;
	staticFunctions._tempVector2 = null;
	
		
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.Global.Utilities.Math.LineIntersectionWithCircle2d::init");
		
		this.point1 = Point.create();
		this.point2 = Point.create();
		this.parameter1 = NaN;
		this.parameter2 = NaN;
		
		this._setAsNullResult();
		
		return this;
	}
	
	/**
	 * Sets the result to null
	 */
	objectFunctions._setAsNullResult = function() {
		this.point1.x = NaN;
		this.point1.y = NaN;
		this.point2.x = NaN;
		this.point2.y = NaN;
		this.parameter1 = NaN;
		this.parameter2 = NaN;
		this.theResult = false;
	}
	
	/**
	 * Finds the intersections between a line and a circle
	 */
	objectFunctions.findIntersection = function(aLinePoint, aLineVector, aCirclePoint, aRadius) {
		var closestParameter = LineIntersection2d.findClosestParameterToPoint(aLinePoint, aLineVector, aCirclePoint);
		var closestVector =  ClassReference.getTempPoint();
		closestVector.x = (aLinePoint.x+closestParameter*aLineVector.x)-aCirclePoint.x;
		closestVector.y = (aLinePoint.y+closestParameter*aLineVector.y)-aCirclePoint.y;
		var lineLength = VectorFunctions.lengthFromVector(aLineVector);
		
		var theLength = VectorFunctions.lengthFromVector(closestVector);
		
		if(theLength > theLength) {
			this._setAsNullResult();
			return false;
		}
		
		if(theLength == 0) {
			var lengthToCenter = VectorFunctions.lengthFromVectorValues2d(aCirclePoint.x-aLinePoint.x, aCirclePoint.y-aLinePoint.y);
			var length1 = lengthToCenter-aRadius;
			var length2 = lengthToCenter+aRadius;
			this.parameter1 = length1/lineLength;
			this.parameter2 = length2/lineLength;
			this.point1.x = aLinePoint.x+this.parameter1*aLineVector.x;
			this.point1.y = aLinePoint.y+this.parameter1*aLineVector.y;
			this.point2.x = aLinePoint.x+this.parameter2*aLineVector.x;
			this.point2.y = aLinePoint.y+this.parameter2*aLineVector.y;
			this.theResult = true;
			return true;
		}
		
		var offsetAngle = Math.acos(theLength/aRadius);
		var baseAngle = VectorFunctions.angleFromVector(closestVector);
		
		var sideMultiplier = 1; //METODO
		
		VectorFunctions.normalizeSelf2d(closestVector);
		var normalLineVector =  ClassReference.getTempPoint();
		normalLineVector.x = -1*aLineVector.y;
		normalLineVector.y = aLineVector.x;
		VectorFunctions.normalizeSelf2d(normalLineVector);
		
		var sideMultiplier = -1*VectorFunctions.dotProduct2d(closestVector, normalLineVector);
		
		this.point1.x = aRadius*Math.cos(baseAngle+sideMultiplier*offsetAngle);
		this.point1.y = aRadius*Math.sin(baseAngle+sideMultiplier*offsetAngle);
		this.point2.x = aRadius*Math.cos(baseAngle-sideMultiplier*offsetAngle);
		this.point2.y = aRadius*Math.sin(baseAngle-sideMultiplier*offsetAngle);
		
		this.parameter1 = VectorFunctions.lengthFromVectorValues2d(this.point1.x-aLinePoint.x, this.point1.y-aLinePoint.y)/lineLength;
		this.parameter2 = VectorFunctions.lengthFromVectorValues2d(this.point2.x-aLinePoint.x, this.point2.y-aLinePoint.y)/lineLength;
		
		this.theResult = true;
		return true;
	};
	
	staticFunctions.getTempVector = function() {
		if(ClassReference._tempVector == null) {
			ClassReference._tempVector = Point.create();
		}
		return ClassReference._tempVector;
	};
	
	staticFunctions.getTempVector2 = function() {
		if(ClassReference._tempVector2 == null) {
			ClassReference._tempVector2 = Point.create();
		}
		return ClassReference._tempVector2;
	};

});