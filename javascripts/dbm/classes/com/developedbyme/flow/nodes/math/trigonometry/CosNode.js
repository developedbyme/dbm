dbm.registerClass("com.developedbyme.flow.nodes.math.trigonometry.CosNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.trigonometry.CosNode");
	
	var CosNode = dbm.importClass("com.developedbyme.flow.nodes.math.trigonometry.CosNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.trigonometry.CosNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.trigonometry.CosNode::_update");
		this._outputValue.setValueWithFlow(Math.cos(this._inputValue.getValueWithoutFlow()), aFlowUpdateNumber);
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