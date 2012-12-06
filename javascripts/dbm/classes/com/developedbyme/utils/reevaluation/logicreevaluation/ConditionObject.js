dbm.registerClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject", "com.developedbyme.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject");
	
	var ConditionObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject");
	
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	
	var ConditionEvaluation = dbm.importClass("com.developedbyme.utils.logic.ConditionEvaluation");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject::_init");
		
		this.superCall();
		
		this.inputValue1Reevaluator = null;
		this.inputValue2Reevaluator = null;
		this.conditionTypeReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject::reevaluate");
		var inputValue1 = this.inputValue1Reevaluator.reevaluate(aBaseObject);
		var inputValue2 = this.inputValue2Reevaluator.reevaluate(aBaseObject);
		var conditionType = this.conditionTypeReevaluator.reevaluate(aBaseObject);
		return ConditionEvaluation.evaluateCondition(inputValue1, conditionType, inputValue2);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.inputValue1Reevaluator = null;
		this.inputValue2Reevaluator = null;
		this.conditionTypeReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aInputValue1, aConditionType, aInputValue2) {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionObject::createCommand (static)");
		var newCommand = (new ConditionObject()).init();
		
		this.inputValue1Reevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue1);
		this.inputValue2Reevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue2);
		this.conditionTypeReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aConditionType);
		
		return newCommand;
	};
});