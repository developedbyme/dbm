dbm.registerClass("com.developedbyme.core.data.curves.BezierCurve", "com.developedbyme.core.data.curves.Curve", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.BezierCurve");
	
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.curves.BezierCurve");
		
		this.superCall();
		
		this._curveDegree = 0;
		this._isCompact = false;
		this.setType = "bezierCurve";
		
		return this;
	}
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "bezierCurve":
				return true;
			case "compactBezierCurve":
				return this._isCompact;
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
	
	objectFunctions.getMaxParameter = function() {
		var compactMoveLength = this._isCompact ? 0 : 1;
		return (this.pointsArray.length-1+compactMoveLength)/(this._curveDegree+compactMoveLength);
	}
	
	objectFunctions.setAsCompact = function(aIsCompact) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve::setAsCompact");
		this._isCompact = !VariableAliases.isFalse(aIsCompact);
	}
	
	objectFunctions.isCompact = function() {
		return this._isCompact;
	}
	
	objectFunctions.setupFromArray = function(aArray, aNumberOfDimensions) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve::setupFromArray");
		var currentArray = aArray;
		var theLength = currentArray.length;
		var compactMoveLength = this._isCompact ? 0 : 1;
		if((((theLength/aNumberOfDimensions)-1+compactMoveLength)%(this._curveDegree+compactMoveLength)) != 0) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setupFromArray", "Length " + (theLength/aNumberOfDimensions) + " doesn't fit curve degree (" + this._curveDegree + ").");
			return;
		}
		this.superCall(aArray, aNumberOfDimensions);
	}
	
	objectFunctions._getSegmentArray = function(aSegementStartParameter, aReturnArray) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve._getSegmentArray");
		//console.log(this._curveDegree);
		
		var compactMoveLength = this._isCompact ? 0 : 1;
		
		for(var i = -1; ++i <= this._curveDegree;) {
			//console.log(aSegementStartParameter, i, (this._curveDegree)*aSegementStartParameter+i);
			aReturnArray[i] = this.pointsArray[(this._curveDegree+compactMoveLength)*aSegementStartParameter+i];
		}
	}
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve::getPointOnCurve");
		//console.log(aParameter, aOutputPoint);
		var segmentStart = Math.floor(aParameter);
		var localParameter = aParameter-segmentStart;
		var compactMoveLength = this._isCompact ? 0 : 1;
		var maxParameter = (this.pointsArray.length/(this._curveDegree+compactMoveLength));
		if(aParameter < 0 || segmentStart > maxParameter) {
			//METODO: error message
			aOutputPoint.x = NaN;
			aOutputPoint.y = NaN;
			aOutputPoint.z = NaN;
			return;
		}
		if(segmentStart == maxParameter) {
			segmentStart--;
			localParameter = 1;
		}
		var segmentPointsArray = new Array(this._curveDegree+1);
		this._getSegmentArray(segmentStart, segmentPointsArray);
		dbm.singletons.dbmCurveEvaluator.getPointOnBezierSegment3d(segmentPointsArray, localParameter, aOutputPoint);
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
	
	objectFunctions.createSameTypeOfCurve = function() {
		var newCurve = (new ClassReference()).init();
		newCurve.setType = this.setType;
		newCurve.setAsCompact(this._isCompact);
		newCurve.setCurveDegree(this._curveDegree);
		return newCurve;
	};
	
	staticFunctions.createWithLength = function(aDegree, aIsCompact, aLength) {
		var newSet = (new ClassReference()).init();
		newSet.setCurveDegree(aDegree);
		newSet.setAsCompact(aIsCompact);
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
	
	staticFunctions.createWithValues = function(aDegree, aIsCompact, aValues, aNumberOfDimensions) {
		//console.log("com.developedbyme.core.data.curves.BezierCurve::createWithValues");
		var newSet = (new ClassReference()).init();
		newSet.setCurveDegree(aDegree);
		newSet.setAsCompact(aIsCompact);
		newSet.setupFromArray(aValues, aNumberOfDimensions);
		return newSet;
	};
	
	staticFunctions.createAnimationCurve = function(aLength) {
		var newSet = (new ClassReference()).init();
		newSet.setCurveDegree(3);
		newSet.setAsCompact(false);
		newSet.setType = "animationCurve";
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
});