/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
	var RepeatedRangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._minValue = this.createProperty("minValue", 0);
		this._maxValue = this.createProperty("maxValue", 1);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._minValue, this._maxValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode::_update");
		
		var minValue = this._minValue.getValueWithoutFlow();
		var maxValue = this._maxValue.getValueWithoutFlow();
		var inputValue = this._inputValue.getValueWithoutFlow();
		
		var difference = maxValue-minValue;
		var length = inputValue-minValue;
		var times = Math.floor(length/difference);
		var rangeValue = length-(times*difference);
				
		this._outputValue.setValueWithFlow(rangeValue+minValue, aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aMin, aMax) {
		var newNode = (new RepeatedRangeNode()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("minValue", aMin);
		newNode.setPropertyInputWithoutNull("maxValue", aMax);
		return newNode;
	};
});