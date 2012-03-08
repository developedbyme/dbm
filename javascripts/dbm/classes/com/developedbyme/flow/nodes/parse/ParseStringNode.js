dbm.registerClass("com.developedbyme.flow.nodes.parse.ParseStringNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.parse.ParseStringNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.parse.ParseStringNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.parse.ParseStringNode::_update");
		this._outputValue.setValueWithFlow(this._inputValue.getValueWithoutFlow().toString(), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	}
});