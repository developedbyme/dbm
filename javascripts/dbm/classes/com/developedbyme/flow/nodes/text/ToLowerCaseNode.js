dbm.registerClass("com.developedbyme.flow.nodes.text.ToLowerCaseNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.text.ToLowerCaseNode");
	
	var ToLowerCaseNode = dbm.importClass("com.developedbyme.flow.nodes.text.ToLowerCaseNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.text.ToLowerCaseNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.text.ToLowerCaseNode::_update");
		this._outputValue.setValueWithFlow(this._inputValue.getValueWithoutFlow().toString().toLowerCase(), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});