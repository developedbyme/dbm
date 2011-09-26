dbm.registerClass("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode");
	
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode::init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._numberOfDecimals = this.createProperty("numberOfDecimals", 3);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._numberOfDecimals], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.round.RoundToNumberOfDecimalsNode::_update");
		this._outputValue.setValueWithFlow(NumberFunctions.roundToNumberOfDecimals(this._inputValue.getValueWithoutFlow(), this._numberOfDecimals.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});