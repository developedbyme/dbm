dbm.registerClass("com.developedbyme.flow.nodes.math.round.FloorNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.round.FloorNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.round.FloorNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.round.FloorNode::_update");
		this._outputValue.setValueWithFlow(Math.floor(this._inputValue.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});