/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.reevaluation.logicreevaluation.ConditionObject", "dbm.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject");
	//"use strict";
	
	//Self reference
	var ConditionObject = dbm.importClass("dbm.utils.reevaluation.logicreevaluation.ConditionObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var ConditionEvaluation = dbm.importClass("dbm.utils.logic.ConditionEvaluation");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.reevaluation.logicreevaluation.ConditionObject::_init");
		
		this.superCall();
		
		this.inputValue1Reevaluator = null;
		this.inputValue2Reevaluator = null;
		this.conditionTypeReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("dbm.utils.reevaluation.logicreevaluation.ConditionObject::reevaluate");
		//console.log(aBaseObject);
		
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
		//console.log("dbm.utils.reevaluation.logicreevaluation.ConditionObject::createCommand (static)");
		var newCommand = (new ConditionObject()).init();
		
		newCommand.inputValue1Reevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue1);
		newCommand.inputValue2Reevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue2);
		newCommand.conditionTypeReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aConditionType);
		
		return newCommand;
	};
});