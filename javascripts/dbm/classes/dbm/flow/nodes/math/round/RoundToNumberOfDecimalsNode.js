/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.round.RoundToNumberOfDecimalsNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.round.RoundToNumberOfDecimalsNode");
	//"use strict";
	
	var RoundToNumberOfDecimalsNode = dbm.importClass("dbm.flow.nodes.math.round.RoundToNumberOfDecimalsNode");
	
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.round.RoundToNumberOfDecimalsNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._numberOfDecimals = this.createProperty("numberOfDecimals", 3);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._numberOfDecimals], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.round.RoundToNumberOfDecimalsNode::_update");
		this._outputValue.setValueWithFlow(NumberFunctions.roundToNumberOfDecimals(this._inputValue.getValueWithoutFlow(), this._numberOfDecimals.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aInputValue, aNumberOfDecimals) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("numberOfDecimals", aNumberOfDecimals);
		return newNode;
	};
});