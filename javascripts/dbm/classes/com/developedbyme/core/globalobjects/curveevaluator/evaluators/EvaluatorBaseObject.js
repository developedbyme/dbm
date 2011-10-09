dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject");

	var BaseObject = dbm.importClass("com.developedbyme.Global.BaseObject");
	var PointSet = dbm.importClass("com.developedbyme.core.data.points.PointSet");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject::init")
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.canEvaluate = function(aPointSet) {
		return false;
	};
	
	objectFunctions.getPartOfCurve = function(aPointSet, aEndParameter, aStartParameter, aExactness, aReturnCurve) {
		//MENOTE: should be overridden
	};
});