dbm.registerClass("com.developedbyme.flow.nodes.math.convertion.DegreesToRadiansNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.convertion.DegreesToRadiansNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.math.convertion.DegreesToRadiansNode::init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.convertion.DegreesToRadiansNode::_update");
		this._outputValue.setValueWithFlow(Math.PI*this._inputValue.getValueWithoutFlow()/180, aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
});