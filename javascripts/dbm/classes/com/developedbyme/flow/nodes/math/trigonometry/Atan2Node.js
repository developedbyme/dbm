dbm.registerClass("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node");
	
	var Atan2Node = dbm.importClass("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node::_update");
		this._outputValue.setValueWithFlow(Math.atan2(this._y.getValueWithoutFlow(), this._x.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		return newNode;
	}
});