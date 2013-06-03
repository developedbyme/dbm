dbm.registerClass("com.developedbyme.flow.nodes.math.range.RangeNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.range.RangeNode");
	
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.range.RangeNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._minInputValue = this.createProperty("minInputValue", 0);
		this._maxInputValue = this.createProperty("maxInputValue", 1);
		this._minOutputValue = this.createProperty("minOutputValue", 0);
		this._maxOutputValue = this.createProperty("maxOutputValue", 1);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._minInputValue, this._maxInputValue, this._minOutputValue, this._maxOutputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.range.RangeNode::_update");
		
		var minInputValue = this._minInputValue.getValueWithoutFlow();
		var maxInputValue = this._maxInputValue.getValueWithoutFlow();
		var minOutputValue = this._minOutputValue.getValueWithoutFlow();
		var maxOutputValue = this._maxOutputValue.getValueWithoutFlow();
		var inputValue = this._inputValue.getValueWithoutFlow();
		
		var parameter = (inputValue-minInputValue)/(maxInputValue-minInputValue);
		
		this._outputValue.setValueWithFlow(parameter*(maxOutputValue-minOutputValue)+minOutputValue, aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._minInputValue = null;
		this._maxInputValue = null;
		this._minOutputValue = null;
		this._maxOutputValue = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aMinInput, aMaxInput, aMinOutput, aMaxOutput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("minInputValue", aMinInput);
		newNode.setPropertyInputWithoutNull("maxInputValue", aMaxInput);
		newNode.setPropertyInputWithoutNull("minOutputValue", aMinOutput);
		newNode.setPropertyInputWithoutNull("maxOutputValue", aMaxOutput);
		return newNode;
	};
});