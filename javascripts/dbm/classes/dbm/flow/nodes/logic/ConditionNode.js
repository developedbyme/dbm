/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.logic.ConditionNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.logic.ConditionNode");
	//"use strict";
	
	var ConditionNode = dbm.importClass("dbm.flow.nodes.logic.ConditionNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var ConditionEvaluation = dbm.importClass("dbm.utils.logic.ConditionEvaluation");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.logic.ConditionNode::_init");
		
		this.superCall();
		
		this._conditionType = this.createProperty("conditionType", "===");
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 1);
		
		this.createUpdateFunctionWithArguments("default", ConditionEvaluation.evaluateCondition, [this._inputValue1, this._conditionType, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._conditionType = null;
		this._inputValue1 = null;
		this._inputValue2 = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aConditionType, aInputValue1, aInputValue2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("conditionType", aConditionType);
		newNode.setPropertyInputWithoutNull("inputValue1", aInputValue1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInputValue2);
		return newNode;
	};
});