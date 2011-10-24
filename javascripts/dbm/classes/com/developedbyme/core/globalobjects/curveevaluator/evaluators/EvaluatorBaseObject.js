dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject");
	
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