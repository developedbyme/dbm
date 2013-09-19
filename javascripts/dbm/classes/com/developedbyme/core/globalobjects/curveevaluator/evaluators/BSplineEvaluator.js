dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator", "com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator::_init")
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.canEvaluate = function(aPointSet, aType, aForward) {
		if(aPointSet.isSetType("bSpline")) {
			return true;
		}
		return false;
	};
	
	staticFunctions.getPartOfCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aReturnCurve) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator::getPartOfCurve");
		var theCurve = aCurve;
		var tempPoint = (new Point()).init();
		var numberOfSegments = Math.round((aEndParameter-aStartParameter)/aExactness);
		for(var i = 0; i < numberOfSegments+1; i++) {
			theCurve.getPointOnCurve((i/numberOfSegments)*(aEndParameter-aStartParameter)+aStartParameter, tempPoint);
			aReturnCurve.pointsArray.push(tempPoint.duplicate());
		}
	};
});