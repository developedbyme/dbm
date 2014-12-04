/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.logic.BooleanSwitchedNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.logic.BooleanSwitchedNode");
	
	var BooleanSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.BooleanSwitchedNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.logic.BooleanSwitchedNode::_init");
		
		this.superCall();
		
		this._switchValue = this.createProperty("switchValue", true);
		this._trueValue = this.createProperty("trueValue", 1);
		this._falseValue = this.createProperty("falseValue", 0);
		this._outputValue = this.createProperty("outputValue", 1);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._switchValue, this._trueValue, this._falseValue], [this._outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aSwtichValue, aTrueValue, aFalseValue) {
		//console.log("dbm.flow.nodes.logic.BooleanSwitchedNode::_update");
		
		return (aSwtichValue ? aTrueValue : aFalseValue);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
		
		this._switchValue = null;
		this._trueValue = null;
		this._falseValue = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aSwitchValue, aTrueValue, aFalseValue) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("switchValue", aSwitchValue);
		newNode.setPropertyInputWithoutNull("trueValue", aTrueValue);
		newNode.setPropertyInputWithoutNull("falseValue", aFalseValue);
		return newNode;
	};
});