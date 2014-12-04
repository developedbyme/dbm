/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.logic.BitwiseOperatorNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.logic.BitwiseOperatorNode");
	
	var BitwiseOperatorNode = dbm.importClass("dbm.flow.nodes.logic.BitwiseOperatorNode");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.logic.BitwiseOperatorNode::_init");
		
		this.superCall();
		
		this._operatorType = this.createProperty("operatorType", "&");
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._operatorType, this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aOperatorType, aInputValue1, aInputValue2) {
		//console.log("dbm.flow.nodes.logic.BitwiseOperatorNode::_update");
		
		switch(aOperatorType) {
			case "&":
				return (aInputValue1 & aInputValue2);
			case "|":
				return (aInputValue1 | aInputValue2);
			case "^":
				return (aInputValue1 ^ aInputValue2);
			case "<<":
				return (aInputValue1 << aInputValue2);
			case ">>":
				return (aInputValue1 >>> aInputValue2);
			case ">>>":
				return (aInputValue1 >>> aInputValue2);
		}
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "BitwiseOperatorNode", "_update", "Unknown operator type " + aOperatorType + ".");
		return 0;
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