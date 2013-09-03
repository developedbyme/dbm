dbm.registerClass("com.developedbyme.flow.nodes.parse.ParseIntNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.parse.ParseIntNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.parse.ParseIntNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._radix = this.createProperty("outputValue", 10);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._radix], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.parse.ParseIntNode::_update");
		this._outputValue.setValueWithFlow(parseInt(this._inputValue.getValueWithoutFlow(), this._radix.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aRadix) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setPropertyInputWithoutNull("radix", aRadix);
		return newNode;
	};
});