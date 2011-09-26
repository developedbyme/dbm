dbm.registerClass("com.developedbyme.flow.nodes.logic.BitwiseOperatorNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.logic.BitwiseOperatorNode");
	
	var BitwiseOperatorNode = dbm.importClass("com.developedbyme.flow.nodes.logic.BitwiseOperatorNode");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.logic.BitwiseOperatorNode::init");
		
		this.superCall();
		
		this._operatorType = this.createProperty("operatorType", "&");
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._operatorType, this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.logic.BitwiseOperatorNode::_update");
		
		var returnValue;
		var operatorType = this.operatorType.getValueWithoutFlow();
		var inputValue1 = this._inputValue1.getValueWithoutFlow();
		var inputValue2 = this._inputValue2.getValueWithoutFlow();
		switch(operatorType) {
			case "&":
				returnValue = (inputValue1 & inputValue2);
				break;
			case "|":
				returnValue = (inputValue1 | inputValue2);
				break;
			case "^":
				returnValue = (inputValue1 ^ inputValue2);
				break;
			case "<<":
				returnValue = (inputValue1 << inputValue2);
				break;
			case ">>":
				returnValue = (inputValue1 >>> inputValue2);
				break;
			case ">>>":
				returnValue = (inputValue1 >>> inputValue2);
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_update", "Unknown operator type " + operatorType + ".");
				returnValue = 0;
				break;
		}
		
		this._outputValue.setValueWithFlow(returnValue, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._operatorType = null;
		this._inputValue1 = null;
		this._inputValue2 = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOperatorType, aInputValue1, aInputValue2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("operatorType", aOperatorType);
		newNode.setPropertyInputWithoutNull("inputValue1", aInputValue1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInputValue2);
		return newNode;
	};
});