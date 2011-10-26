dbm.registerClass("com.developedbyme.flow.nodes.math.MultiplicationNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.MultiplicationNode");
	
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.math.MultiplicationNode::init");
		
		this.superCall();
		
		this._inputValue1 = this.createProperty("inputValue1", 1);
		this._inputValue2 = this.createProperty("inputValue2", 1);
		this._outputValue = this.createProperty("outputValue", 1);
		
		this.createUpdateFunction("default", this._update, [this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.MultiplicationNode::_update");
		this._outputValue.setValueWithFlow(this._inputValue1.getValueWithoutFlow()*this._inputValue2.getValueWithoutFlow(), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue1 = null;
		this._inputValue2 = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput1, aInput2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue1", aInput1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInput2);
		return newNode;
	}
});