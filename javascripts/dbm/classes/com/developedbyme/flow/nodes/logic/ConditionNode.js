dbm.registerClass("com.developedbyme.flow.nodes.logic.ConditionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.ConditionNode");
	//"use strict";
	
	var ConditionNode = dbm.importClass("com.developedbyme.flow.nodes.logic.ConditionNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.ConditionNode::_init");
		
		this.superCall();
		
		this._conditionType = this.createProperty("conditionType", "==");
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 1);
		
		this.createUpdateFunction("default", this._update, [this._conditionType, this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.logic.ConditionNode::_update");
		
		var returnValue;
		var conditionType = this._conditionType.getValueWithoutFlow();
		var inputValue1 = this._inputValue1.getValueWithoutFlow();
		var inputValue2 = this._inputValue2.getValueWithoutFlow();
		switch(conditionType) {
			case "==":
				returnValue = (inputValue1 == inputValue2);
				break;
			case "===":
				returnValue = (inputValue1 === inputValue2);
				break;
			case ">=":
				returnValue = (inputValue1 >= inputValue2);
				break;
			case ">":
				returnValue = (inputValue1 > inputValue2);
				break;
			case "<=":
				returnValue = (inputValue1 <= inputValue2);
				break;
			case "<":
				returnValue = (inputValue1 < inputValue2);
				break;
			case "!=":
				returnValue = (inputValue1 != inputValue2);
				break;
			case "&&":
				returnValue = (inputValue1 && inputValue2);
				break;
			case "||":
				returnValue = (inputValue1 || inputValue2);
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Unknown condition type " + conditionType + ".");
				returnValue = 0;
				break;
		}
		
		this._outputValue.setValueWithFlow(returnValue, aFlowUpdateNumber);
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