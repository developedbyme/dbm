/**
 * Object for creating a multi segment bezier curve from an array of points.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	
	staticFunctions.TYPE_FLAG_IN = 1;
	staticFunctions.TYPE_FLAG_OUT = (1<<1);
	staticFunctions.SKIP_VECTORS_FLAG = (1<<2);
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d");
		
		this.superCall();
		
		this._currentPoint = null;
		this._inVectorLength = null;
		this._outVectorLength = null;
		
		this._isCompact = null;
		this._currentOutputIndex = null;
		
		this._outputCurve = null;
		this._outputArray = null;
		
		this._currentVector = (new Point()).init();
		this._averageVector = (new Point()).init();
		this._inVector = (new Point()).init();
		this._crossVector = (new Point()).init();
		this._finalVector = (new Point()).init();
		this._outVector = (new Point()).init();
		
		return this;
	};
	
	/**
	 * Adds points from the current vectors.
	 *
	 * @param	aTypeFlag	The type to add.
	 */
	objectFunctions._createFromCurrentPoint = function(aTypeFlag) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d::_createFromCurrentPoint");
		var theLength = Math.min(this._inVectorLength, this._outVectorLength);
		var useStraight = Boolean(aTypeFlag & ClassReference.SKIP_VECTORS_FLAG);
		if(!useStraight) {
			var is180 = VectorFunctions.dotProduct2d(this._outVector, this._inVector) > 0.999;
			
			this._averageVector.x = this._inVector.x+this._outVector.x;
			this._averageVector.y = this._inVector.y+this._outVector.y;
			
			var isStraight = (Math.abs(this._averageVector.x) < 0.001 && Math.abs(this._averageVector.y) < 0.001) || (theLength < 0.001);
			
			useStraight = (is180 || isStraight);
			
			if(!useStraight) {
				VectorFunctions.normalizeSelf2d(this._averageVector);
				VectorFunctions.crossProduct3d(this._outVector, this._inVector, this._crossVector);
				VectorFunctions.crossProduct3d(this._averageVector, this._crossVector, this._finalVector);
				VectorFunctions.normalizeSelf2d(this._finalVector);
			}
		}
		
		if(aTypeFlag & ClassReference.TYPE_FLAG_IN) {
			if(useStraight) {
				this._outputArray[this._currentOutputIndex].x = this._currentPoint.x+this._inVectorLength*this._inVector.x;
				this._outputArray[this._currentOutputIndex].y = this._currentPoint.y+this._inVectorLength*this._inVector.y;
				this._currentOutputIndex++;
			}
			else {
				this._outputArray[this._currentOutputIndex].x = this._currentPoint.x+(-1)*theLength*this._finalVector.x;
				this._outputArray[this._currentOutputIndex].y = this._currentPoint.y+(-1)*theLength*this._finalVector.y;
				this._currentOutputIndex++;
			}
		}
		
		this._outputArray[this._currentOutputIndex].x = this._currentPoint.x;
		this._outputArray[this._currentOutputIndex].y = this._currentPoint.y;
		this._currentOutputIndex++;
		
		if((!this._isCompact) && (aTypeFlag & ClassReference.TYPE_FLAG_IN) && (aTypeFlag & ClassReference.TYPE_FLAG_OUT)) {
			this._outputArray[this._currentOutputIndex].x = this._currentPoint.x;
			this._outputArray[this._currentOutputIndex].y = this._currentPoint.y;
			this._currentOutputIndex++;
		}
		
		if(aTypeFlag & ClassReference.TYPE_FLAG_OUT) {
			if(useStraight) {
				this._outputArray[this._currentOutputIndex].x = this._currentPoint.x+this._outVectorLength*this._outVector.x;
				this._outputArray[this._currentOutputIndex].y = this._currentPoint.y+this._outVectorLength*this._outVector.y;
				this._currentOutputIndex++;
			}
			else {
				this._outputArray[this._currentOutputIndex].x = this._currentPoint.x+theLength*this._finalVector.x;
				this._outputArray[this._currentOutputIndex].y = this._currentPoint.y+theLength*this._finalVector.y;
				this._currentOutputIndex++;
			}
		}
	};
	
	/**
	 * Changes so that the out vector is now the reverse in vector.
	 */
	objectFunctions._moveOutVectorToInVector = function() {
		//console.log("_moveOutVectorToInVector");
		
		this._inVector.x = -1*this._outVector.x;
		this._inVector.y = -1*this._outVector.y;
		this._inVectorLength = this._outVectorLength;	
	};
	
	/**
	 * Sets up a vector from 2 points.
	 *
	 * @param	aCurrentPoint			The start point of the vector.
	 * @param	aVectorPointingPoint	The point that the vector is pointing on.
	 * @param	aOutputVector			The vector that gets the values and are normalized.
	 * @return	The length of the vector befor normalization.
	 */
	objectFunctions._setupVector = function(aCurrentPoint, aVectorPointingPoint, aOutputVector) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d::_setupVector");
		//console.log(aCurrentPoint, aVectorPointingPoint, aOutputVector);
		aOutputVector.x = aVectorPointingPoint.x-aCurrentPoint.x;
		aOutputVector.y = aVectorPointingPoint.y-aCurrentPoint.y;
		var theLength = (1/3)*Math.sqrt(Math.pow(aOutputVector.x, 2) + Math.pow(aOutputVector.y, 2));
		if(theLength > 0.0001) {
			VectorFunctions.normalizeSelf2d(aOutputVector);
		}
		return theLength;
	};
	
	/**
	 * Creates the curve.
	 *
	 * @param	aPointsArray	The points that defines how the curve should be created.
	 * @param	aReturnCurve	The curve that gets the new values.
	 * @param	aIsRound		If the curve is round or not.
	 */
	objectFunctions.createCurve = function(aPointsArray, aReturnCurve, aIsRound) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.creators.CreateMultiSegmentBezierCurveFromPoints2d::createCurve");
		//console.log(aPointsArray, aReturnCurve, aIsRound);
		this._isCompact = aReturnCurve.isCompact();
		this._outputArray = aReturnCurve.pointsArray;
		var currentArray = aPointsArray;
		this._currentOutputIndex = 0;
		
		this._currentPoint = currentArray[0];
		this._inVectorLength = this._setupVector(this._currentPoint, currentArray[currentArray.length-1], this._inVector);
		this._outVectorLength = this._setupVector(this._currentPoint, currentArray[1], this._outVector);
		
		if(aIsRound) {
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_OUT);
		}
		else {
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_OUT | ClassReference.SKIP_VECTORS_FLAG);
		}
		
		for(var i = 0; ++i < currentArray.length-1;) {
			this._moveOutVectorToInVector();
			
			this._currentPoint = currentArray[i];
			this._outVectorLength = this._setupVector(this._currentPoint, currentArray[i+1], this._outVector);
			
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_IN | ClassReference.TYPE_FLAG_OUT);
		}
		
		this._moveOutVectorToInVector();
		
		this._currentPoint = currentArray[currentArray.length-1];
		this._outVectorLength = this._setupVector(this._currentPoint, currentArray[0], this._outVector);
		
		if(aIsRound) {
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_IN | ClassReference.TYPE_FLAG_OUT);
			
			this._moveOutVectorToInVector();

			this._currentPoint = currentArray[0];
			this._outVectorLength = this._setupVector(this._currentPoint, currentArray[1], this._outVector);
			
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_IN);
		}
		else {
			this._createFromCurrentPoint(ClassReference.TYPE_FLAG_IN | ClassReference.SKIP_VECTORS_FLAG);
		}
	};
});