/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.DivisionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.DivisionNode");
	//"use strict";
	
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.DivisionNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._divisor = this.createProperty("divisor", 1);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [this._inputValue, this._divisor], [this._outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aInputValue, aDivisor) {
		//console.log("com.developedbyme.flow.nodes.math.DivisionNode::_update");
		return aInputValue/aDivisor;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._divisor = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aDivisor) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("divisor", aDivisor);
		return newNode;
	};
});