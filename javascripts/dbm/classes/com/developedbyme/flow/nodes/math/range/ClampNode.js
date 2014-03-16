/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.range.ClampNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.range.ClampNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.range.ClampNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._minValue = this.createProperty("minValue", 0);
		this._maxValue = this.createProperty("maxValue", 1);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._minValue, this._maxValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.range.ClampNode::_update");
		this._outputValue.setValueWithFlow(Math.max(Math.min(this._inputValue1.getValueWithoutFlow()+this._maxValue.getValueWithoutFlow()), this._minValue.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});