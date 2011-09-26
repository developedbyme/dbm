dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject");

	var BaseObject = dbm.importClass("com.developedbyme.Global.BaseObject");
	var PointSet = dbm.importClass("com.developedbyme.core.data.points.PointSet");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject")
	}
	
	objectFunctions.canEvaluate = function(aPointSet, aType, aForward) {
		return false;
	}
	
	objectFunctions.getEvaluationFunction = function(aPointSet, aType, aForward) {
		return null;
	}
});