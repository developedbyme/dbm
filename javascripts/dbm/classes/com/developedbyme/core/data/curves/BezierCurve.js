dbm.registerClass("com.developedbyme.core.data.curves.BezierCurve", "com.developedbyme.core.data.curves.Curve", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.BezierCurve");
	
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.curves.BezierCurve");
		
		this.superCall();
		
		this._curveDegree = 0;
		this.setType = "bezierCurve";
		
		return this;
	}
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "bezierCurve":
				return true;
			default:
				return this.superCall(aType);
		}
	}
	
	objectFunctions.setCurveDegree = function(aDegree) {
		this._curveDegree = aDegree;
	}
	
	objectFunctions.getCurveDegree = function() {
		return this._curveDegree;
	}
	
	objectFunctions.isCompact = function() {
		return false;
	}
	
	objectFunctions.setupFromArray = function(aArray) {
		var currentArray = aArray;
		var theLength = currentArray.length;
		if((((theLength/this.numberOfDimensions))%(this._curveDegree+1)) != 0) {
			//METODO: error message
			return;
		}
		this.superCall(aArray);
	}
	
	objectFunctions._getSegmentArray = function(aSegementStartParameter, aReturnArray) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve.InternalFunctionality::getSegmentArray");
		//console.log(this._curveDegree);
		for(var i = -1; ++i <= this._curveDegree;) {
			//console.log(aSegementStartParameter, i, (this._curveDegree)*aSegementStartParameter+i);
			aReturnArray[i] = this.pointsArray[(this._curveDegree+1)*aSegementStartParameter+i];
		}
	}
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		var segmentStart = Math.floor(aParameter);
		var localParameter = aParameter-segmentStart;
		var maxParameter = (this.pointsArray.length/(this._curveDegree+1));
		if(aParameter < 0 || segmentStart > maxParameter) {
			//METODO: error message
			aOutputPoint.x = NaN;
			aOutputPoint.y = NaN;
			return;
		}
		if(segmentStart == maxParameter) {
			segmentStart--;
			localParameter = 1;
		}
		var segmentPointsArray = new Array(this._curveDegree+1);
		this._getSegmentArray(segmentStart, segmentPointsArray);
		dbm.singletons.dbmCurveEvaluator.getPointOnBezierSegment2d(segmentPointsArray, localParameter, aOutputPoint);
	}
	
	objectFunctions.getTangentOnCurve = function(aParameter, aOutputPoint) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve.getTangentOnCurve");
		var segmentStart = Math.floor(aParameter);
		var localParameter = aParameter-segmentStart;
		var maxParameter = (this.pointsArray.length/(this._curveDegree+1));
		if(aParameter < 0 || segmentStart > maxParameter) {
			//METODO: error message
			aOutputPoint.x = NaN;
			aOutputPoint.y = NaN;
			return;
		}
		if(segmentStart == maxParameter) {
			segmentStart--;
			localParameter = 1;
		}
		var segmentPointsArray = new Array(this._curveDegree+1);
		this._getSegmentArray(uint(segmentStart), segmentPointsArray);
		dbm.singletons.dbmCurveEvaluator.getTangentOnBezierSegment2d(segmentPointsArray, localParameter, aOutputPoint);
	}
	
	objectFunctions.getNormalOnCurve = function(aParameter, aOutputPoint) {
		this.getTangentOnCurve(aParameter, aOutputPoint);
		var tempValue = -1*aOutputPoint.x;
		aOutputPoint.x = aOutputPoint.y;
		aOutputPoint.y = tempValue;
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