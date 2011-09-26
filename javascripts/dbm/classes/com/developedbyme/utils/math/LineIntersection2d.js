/**
 * Class for determin where two lines collide.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.2.01
 */
dbm.registerClass("com.developedbyme.utils.math.LineIntersection2d", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.LineIntersection2d");
	
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	
	staticFunctions.QUALIFY_TYPE_ALL = "all";
	staticFunctions.QUALIFY_TYPE_ALL_AND_NULL_RESULTS = "allAndNullResults";
	staticFunctions.QUALIFY_TYPE_ON_LINE = "onLine";
	staticFunctions.QUALIFY_TYPE_ON_POINT_SET = "onPointSet";
	staticFunctions.QUALIFY_TYPE_ON_ALL = "onAll";
		
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.Global.Utilities.Math.LineIntersection2d");
		
		this._setAsNullResult();
		
		return this;
	}
	
	/**
	 * Sets the result to null
	 */
	objectFunctions._setAsNullResult = function() {
		this.xValue = NaN;
		this.yValue = NaN;
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
		//console.log("com.developedbyme.Global.Utilities.Math.LineIntersection.findLineIntersection");
		//console.log(aPoint1, aVector1, aPoint2, aVector2);
		
		if(aVector1.xValue == 0) {
			if(aVector2.xValue == 0) {
				this._setAsNullResult();
				return false;
			}
			if(aVector1.yValue == 0) {
				this._setAsNullResult();
				return false;
			}
			this.xValue = aPoint1.xValue;
			
			this.parameter2 = (aPoint1.xValue-aPoint2.xValue)/aVector2.xValue;
			this.yValue = aPoint2.yValue+(aVector2.yValue)*this.parameter2;
			this.parameter1 = (this.yValue-aPoint1.yValue)/(aVector1.yValue);
			
		}
		else if(aVector1.yValue == 0) {
			if(aVector2.yValue == 0) {
				this._setAsNullResult();
				return false;
			}
			this.yValue = aPoint1.yValue;
			
			this.parameter2 = (aPoint1.yValue-aPoint2.yValue)/aVector2.yValue;
			this.xValue = aPoint2.xValue+(aVector2.xValue)*this.parameter2;
			this.parameter1 = (this.xValue-aPoint1.xValue)/(aVector1.xValue);
			
		}
		else if(aVector2.xValue == 0) {
			if(aVector2.yValue == 0) {
				this._setAsNullResult();
				return false;
			}
			this.xValue = aPoint2.xValue;
			
			this.parameter1 = (aPoint2.xValue-aPoint1.xValue)/aVector1.xValue;
			this.yValue = aPoint1.yValue+(aVector1.yValue)*this.parameter1;
			this.parameter2 = (this.yValue-aPoint2.yValue)/(aVector2.yValue);
		}
		else if(aVector2.yValue == 0) {
			this.yValue = aPoint2.yValue;
			
			this.parameter1 = (aPoint2.yValue-aPoint1.yValue)/aVector1.yValue;
			this.xValue = aPoint1.xValue+(aVector1.xValue)*this.parameter1;
			this.parameter2 = (this.xValue-aPoint2.xValue)/(aVector2.xValue);
		}
		else if((aVector1.xValue/aVector1.yValue) == (aVector2.xValue/aVector2.yValue)) {
			this._setAsNullResult();
			return false;
		}
		else {
			this.parameter1 = (aVector2.yValue*(aPoint1.xValue-aPoint2.xValue)-aVector2.xValue*(aPoint1.yValue-aPoint2.yValue))/((aVector2.xValue*aVector1.yValue)-(aVector2.yValue*aVector1.xValue));
			this.xValue = aPoint1.xValue+(aVector1.xValue)*this.parameter1;
			this.yValue = aPoint1.yValue+(aVector1.yValue)*this.parameter1;
			this.parameter2 = (this.yValue-aPoint2.yValue)/(aVector2.yValue);
		}
		return true;
	}
	
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
		if(aType == undefined) {
			 aType = ClassReference.QUALIFY_TYPE_ON_POINT_SET;
		}
		if(aReturnArray == null) {
			aReturnArray = new Array();
		}
		var currentIntersectionObject;
		var currentPoint;
		var lastPoint;
		var tempVector = (new Vector2d()).init();
		var currentArray = aPointSet.pointsArray;
		currentIntersectionObject = (new LineIntersection2d()).init();
		lastPoint = currentArray[0];
		var theLength;
		if(isRound) {
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
				if((aType == ClassReference.QUALIFY_TYPE_ON_LINE) || (aType == ClassReference.QUALIFY_TYPE_ON_BOTH)) {
					if((currentIntersectionObject.parameter1 < 0) || (currentIntersectionObject.parameter1 > 1)) {
						continue;
					}
				}
				if((aType == ClassReference.QUALIFY_TYPE_ON_POINT_SET) || (aType == ClassReference.QUALIFY_TYPE_ON_BOTH)) {
					if((currentIntersectionObject.parameter2 < 0) || (currentIntersectionObject.parameter2 > 1)) {
						continue;
					}
				}
				aReturnArray.push(currentIntersectionObject);
				currentIntersectionObject = (new LineIntersection2d()).init();
			}
			else {
				if(aType == ClassReference.QUALIFY_TYPE_ALL_AND_NULL_RESULTS) {
					aReturnArray.push(currentIntersectionObject);
					currentIntersectionObject = (new LineIntersection2d()).init();
				}
			}
		}
		return aReturnArray;
	}
});