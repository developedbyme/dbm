/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject", "com.developedbyme.utils.reevaluation.ReevaluationBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ObjectReevaluationBaseObject");
	//"use strict";
	
	//Self reference
	var ConditionAnyOfMultipleValuesObject = dbm.importClass("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var ConditionEvaluation = dbm.importClass("com.developedbyme.utils.logic.ConditionEvaluation");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject::_init");
		
		this.superCall();
		
		this.inputValueReevaluator = null;
		this.matchedValuesReevaluator = null;
		this.conditionTypeReevaluator = null;
		
		return this;
	};
	
	objectFunctions.reevaluate = function(aBaseObject) {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject::reevaluate");
		var inputValue = this.inputValueReevaluator.reevaluate(aBaseObject);
		var currentArray = this.matchedValuesReevaluator.reevaluate(aBaseObject);
		var conditionType = this.conditionTypeReevaluator.reevaluate(aBaseObject);
		
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentValue = currentArray[i];
			var currentResult = ConditionEvaluation.evaluateCondition(inputValue, conditionType, currentValue);
			if(currentResult) {
				return true
			}
		}
		
		return false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.inputValueReevaluator = null;
		this.matchedValuesReevaluator = null;
		this.conditionTypeReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aInputValue, aConditionType, aMatchedValues) {
		//console.log("com.developedbyme.utils.reevaluation.logicreevaluation.ConditionAnyOfMultipleValuesObject::createCommand (static)");
		var newCommand = (new ConditionAnyOfMultipleValuesObject()).init();
		
		newCommand.inputValueReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aInputValue);
		newCommand.matchedValuesReevaluator = ReevaluationCreator.arrayReevaluationOrStaticValue(aMatchedValues);
		newCommand.conditionTypeReevaluator = ReevaluationCreator.reevaluationOrStaticValue(aConditionType);
		
		return newCommand;
	};
});