dbm.registerClass("com.developedbyme.core.data.curves.CompactBezierCurve", "com.developedbyme.core.data.curves.BezierCurve", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.CompactBezierCurve");

	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.curves.CompactBezierCurve");
		
		this.superCall();
		
		this._curveDegree = 0;
		this.setType = "bezierCurve";
		
		return this;
	}
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "compactBezierCurve":
				return true;
			default:
				return this.superCall(aType);
		}
	}
	
	objectFunctions.isCompact = function() {
		return true;
	}
	
	objectFunctions.setupFromArray = function(aArray) {
		var currentArray = aArray;
		var theLength = currentArray.length;
		if((((theLength/this.numberOfDimensions)-1)%this._curveDegree) != 0) {
			//METODO: error message
			return;
		}
		//METODO: this will never verify on the lower level, create separate verify function
		this.superCall(aArray);
	}
	
	objectFunctions._getSegmentArray = function(aSegementStartParameter, aReturnArray) {
		//console.log("com.developedbyme.core.data.curves.CompactBezierCurve.InternalFunctionality::getSegmentArray");
		//console.log(this._curveDegree);
		for(var i = 0; i <= this._curveDegree; i++) {
			//console.log(aSegementStartParameter, i, (this._curveDegree)*aSegementStartParameter+i);
			aReturnArray[i] = this.pointsArray[(this._curveDegree)*aSegementStartParameter+i];
		}
	}
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		var segmentStart = Math.floor(aParameter);
		var localParameter = aParameter-segmentStart;
		var segmentPointsArray = new Array(this._curveDegree+1);
		this._getSegmentArray(uint(segmentStart), segmentPointsArray);
		dbm.singletons.dbmCurveEvaluator.getPointOnBezierSegment3d(segmentPointsArray, localParameter, aOutputPoint);
	}
	
	staticFunctions.createWithLength = function(aNumberOfDimensions, aDegree, aLength) {
		var newSet = (new ClassReference()).init();
		newSet.setCurveDegree(aDegree);
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
	
	staticFunctions.createWithValues = function(aNumberOfDimensions, aDegree, aValues) {
		var newSet = (new ClassReference()).init();
		newSet.setCurveDegree(aDegree);
		newSet.setupFromArray(aValues);
		return newSet;
	};
});