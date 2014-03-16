/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject::_init")
		
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