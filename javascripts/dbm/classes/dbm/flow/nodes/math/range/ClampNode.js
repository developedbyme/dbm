/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.range.ClampNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.range.ClampNode");
	
	//Self reference
	var ClampNode = dbm.importClass("dbm.flow.nodes.math.range.ClampNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constrcutor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.range.ClampNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._minValue = this.createProperty("minValue", 0);
		this._maxValue = this.createProperty("maxValue", 1);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._minValue, this._maxValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.range.ClampNode::_update");
		this._outputValue.setValueWithFlow(
			Math.max(
				Math.min(
					this._inputValue.getValueWithoutFlow(),
					this._maxValue.getValueWithoutFlow()
				),
				this._minValue.getValueWithoutFlow()
			),
			aFlowUpdateNumber
		);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
		
		this._inputValue = null;
		this._minValue = null;
		this._maxValue = null;
		this._outputValue = null;
	};
	
	staticFunctions.create = function(aInput, aMin, aMax) {
		var newNode = (new ClampNode()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("minValue", aMin);
		newNode.setPropertyInputWithoutNull("maxValue", aMax);
		return newNode;
	};
});