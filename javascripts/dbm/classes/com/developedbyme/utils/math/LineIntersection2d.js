/**
 * Class for determin where two lines collide.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.2.01
 */
dbm.registerClass("com.developedbyme.utils.math.LineIntersection2d", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.LineIntersection2d");
	
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	staticFunctions.QUALIFY_TYPE_ALL = "all";
	staticFunctions.QUALIFY_TYPE_ALL_AND_NULL_RESULTS = "allAndNullResults";
	staticFunctions.QUALIFY_TYPE_ON_LINE = "onLine";
	staticFunctions.QUALIFY_TYPE_ON_POINT_SET = "onPointSet";
	staticFunctions.QUALIFY_TYPE_ON_ALL = "onAll";
	
	staticFunctions._tempLineIntersection = null;
	staticFunctions._tempVector = null;
	
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.LineIntersection2d::_init");
		
		this._setAsNullResult();
		
		return this;
	}
	
	/**
	 * Sets the result to null
	 */
	objectFunctions._setAsNullResult = function() {
		this.x = NaN;
		this.y = NaN;
		this.parameter1 = NaN;
		this.parameter2 = NaN;
		this.theResult = false;
	}
	
	/**
	 * Finds the intersection using two points and two vectors.
	 *
	 * @param	aPoint1		A point on the first line.
	 * @param	aVector1	The vector that represents the first line.
	 * @param	aPoint2		A point of the second line.
	 * @param	aVector2	The vector that represents the second line.
	 * @return	If the operation was successful.
	 */
	objectFunctions.findLineIntersection = function(aPoint1, aVector1, aPoint2, aVector2) {
		//console.log("com.developedbyme.utils.math.LineIntersection::findLineIntersection");
		//console.log(aPoint1, aVector1, aPoint2, aVector2);
		
		if(aVector1.x === 0) {
			if(aVector2.x === 0) {
				this._setAsNullResult();
				return false;
			}
			if(aVector1.y === 0) {
				this._setAsNullResult();
				return false;
			}
			this.x = aPoint1.x;
			
			this.parameter2 = (aPoint1.x-aPoint2.x)/aVector2.x;
			this.y = aPoint2.y+(aVector2.y)*this.parameter2;
			this.parameter1 = (this.y-aPoint1.y)/(aVector1.y);
			
		}
		else if(aVector1.y === 0) {
			if(aVector2.y === 0) {
				this._setAsNullResult();
				return false;
			}
			this.y = aPoint1.y;
			
			this.parameter2 = (aPoint1.y-aPoint2.y)/aVector2.y;
			this.x = aPoint2.x+(aVector2.x)*this.parameter2;
			this.parameter1 = (this.x-aPoint1.x)/(aVector1.x);
			
		}
		else if(aVector2.x === 0) {
			if(aVector2.y === 0) {
				this._setAsNullResult();
				return false;
			}
			this.x = aPoint2.x;
			
			this.parameter1 = (aPoint2.x-aPoint1.x)/aVector1.x;
			this.y = aPoint1.y+(aVector1.y)*this.parameter1;
			this.parameter2 = (this.y-aPoint2.y)/(aVector2.y);
		}
		else if(aVector2.y === 0) {
			this.y = aPoint2.y;
			
			this.parameter1 = (aPoint2.y-aPoint1.y)/aVector1.y;
			this.x = aPoint1.x+(aVector1.x)*this.parameter1;
			this.parameter2 = (this.x-aPoint2.x)/(aVector2.x);
		}
		else if((aVector1.x/aVector1.y) === (aVector2.x/aVector2.y)) {
			this._setAsNullResult();
			return false;
		}
		else {
			this.parameter1 = (aVector2.y*(aPoint1.x-aPoint2.x)-aVector2.x*(aPoint1.y-aPoint2.y))/((aVector2.x*aVector1.y)-(aVector2.y*aVector1.x));
			this.x = aPoint1.x+(aVector1.x)*this.parameter1;
			this.y = aPoint1.y+(aVector1.y)*this.parameter1;
			this.parameter2 = (this.y-aPoint2.y)/(aVector2.y);
		}
		return true;
	};
	
	/**
	 * Finds all the collisions between a line and a point set.
	 *
	 * @param	aLinePoint		The start point of the line.
	 * @param	aLineVector		The vector for the line.
	 * @param	aPointSet		The pointset to test against.
	 * @param	aIsRoung		If the point set is round or not.
	 * @param	aType			The to to qualify the hits.
	 * @param	aReturnArray	The array to fill with the results.
	 * @return	The filled aReturnArray (new array if null was passed).
	 */
	staticFunctions.findLineIntersectionsWithPointSet = function(aLinePoint, aLineVector, aPointSet, aIsRound, aType, aReturnArray) {
		//console.log("findLineIntersectionsWithPointSet");
		if(aType === undefined) {
			 aType = ClassReference.QUALIFY_TYPE_ON_POINT_SET;
		}
		if(aReturnArray === null) {
			aReturnArray = new Array();
		}
		var currentIntersectionObject;
		var currentPoint;
		var lastPoint;
		var tempVector = (new Point()).init();
		var currentArray = aPointSet.pointsArray;
		currentIntersectionObject = (new LineIntersection2d()).init();
		lastPoint = currentArray[0];
		var theLength;
		if(aIsRound) {
			theLength = currentArray.length+1;
		}
		else {
			theLength = currentArray.length;
		}
		for(var i = 0; ++i < theLength;) {
			currentPoint = currentArray[i%currentArray.length];
			tempVector.x = currentPoint.x - lastPoint.x;
			tempVector.y = currentPoint.y - lastPoint.y;
			var theResult = currentIntersectionObject.findLineIntersection(aLinePoint, aLineVector, lastPoint, tempVector);
			lastPoint = currentPoint;
			if(theResult) {
				if((aType === ClassReference.QUALIFY_TYPE_ON_LINE) || (aType === ClassReference.QUALIFY_TYPE_ON_BOTH)) {
					if((currentIntersectionObject.parameter1 < 0) || (currentIntersectionObject.parameter1 > 1)) {
						continue;
					}
				}
				if((aType === ClassReference.QUALIFY_TYPE_ON_POINT_SET) || (aType === ClassReference.QUALIFY_TYPE_ON_BOTH)) {
					if((currentIntersectionObject.parameter2 < 0) || (currentIntersectionObject.parameter2 > 1)) {
						continue;
					}
				}
				aReturnArray.push(currentIntersectionObject);
				currentIntersectionObject = (new LineIntersection2d()).init();
			}
			else {
				if(aType === ClassReference.QUALIFY_TYPE_ALL_AND_NULL_RESULTS) {
					aReturnArray.push(currentIntersectionObject);
					currentIntersectionObject = (new LineIntersection2d()).init();
				}
			}
		}
		return aReturnArray;
	};
	
	/**
	 * Finds the parameter where a line is closest to a point.
	 */
	staticFunctions.findClosestParameterToPoint = function(aLinePoint, aLineVector, aPoint) {
		
		var tempLineIntersection = ClassReference.getTempLineIntersection();
		var tempVector = ClassReference.getTempVector();
		
		tempVector.x = aLineVector.y;
		tempVector.y = aLineVector.x;
		
		tempLineIntersection.findLineIntersection(aLinePoint, aLineVector, aPoint, tempVector);
		
		return tempLineIntersection.parameter1;
	};
	
	/**
	 * Finds the parameter where a line is closest to a point in a range.
	 */
	staticFunctions.findClosestParameterToPointInRange = function(aLinePoint, aLineVector, aPoint, aMinAngle, aMaxAngle) {
		//console.log("com.developedbyme.utils.math.LineIntersection2d::findClosestParameterToPointInRange");
		
		var tempLineIntersection = ClassReference.getTempLineIntersection();
		var tempVector = ClassReference.getTempVector();
		
		tempVector.x = aLineVector.y;
		tempVector.y = aLineVector.x;
		
		tempLineIntersection.findLineIntersection(aLinePoint, aLineVector, aPoint, tempVector);
		
		var bestParameter = Math.max(Math.min(tempLineIntersection.parameter1, 1), 0);
		
		var hitAngle = VectorFunctions.angleFromVectorValues((aLinePoint.x+bestParameter*aLineVector.x)-aPoint.x, (aLinePoint.y+bestParameter*aLineVector.y)-aPoint.y);
		
		if(AngleFunctions.angleIsInNormalizedRange(hitAngle, aMinAngle, aMaxAngle)) {
			return bestParameter;
		}
		
		var minParameter2 = NaN;
		var returnParameter = NaN;
		
		tempVector.x = Math.cos(aMinAngle);
		tempVector.y = Math.sin(aMinAngle);
		
		if(tempLineIntersection.findLineIntersection(aLinePoint, aLineVector, aPoint, tempVector)) {
			if(tempLineIntersection.parameter2 >= 0 && (tempLineIntersection.parameter1 >= 0 && tempLineIntersection.parameter1 <= 1)) {
				minParameter2 = tempLineIntersection.parameter2;
				returnParameter = tempLineIntersection.parameter1;
			}
		}
		
		tempVector.x = Math.cos(aMaxAngle);
		tempVector.y = Math.sin(aMaxAngle);
		
		if(tempLineIntersection.findLineIntersection(aLinePoint, aLineVector, aPoint, tempVector)) {
			if(tempLineIntersection.parameter2 >= 0 && (tempLineIntersection.parameter1 >= 0 && tempLineIntersection.parameter1 <= 1)) {
				if(minParameter2 === NaN || tempLineIntersection.parameter2 < minParameter2) {
					minParameter2 = tempLineIntersection.parameter2;
					returnParameter = tempLineIntersection.parameter1;
				}
			}
		}
		
		return returnParameter;
	};
	
	staticFunctions.getTempLineIntersection = function() {
		if(ClassReference._tempLineIntersection === null) {
			ClassReference._tempLineIntersection = (new LineIntersection2d()).init();
		}
		return ClassReference._tempLineIntersection;
	};
	
	staticFunctions.getTempVector = function() {
		if(ClassReference._tempVector === null) {
			ClassReference._tempVector = Point.create();
		}
		return ClassReference._tempVector;
	};

});