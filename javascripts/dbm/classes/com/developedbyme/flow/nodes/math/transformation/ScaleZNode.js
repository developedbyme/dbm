dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.ScaleZNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.ScaleZNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.ScaleZNode::_init");
		
		this.superCall();
		
		this._z = this.createProperty("z", 0);
		this._focusLength = this.createProperty("focusLength", 1);
		this._scale = this.createProperty("scale", 1);
		
		this.createUpdateFunction("default", this._update, [this._z, this._focusLength], [this._scale]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.ScaleZNode::_update");
		
		var z = this._z.getValueWithoutFlow();
		var r = this._focusLength.getValueWithoutFlow();
		
		this._scale.setValueWithFlow(1/((z-r)*(-1/r)), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._z = null;
		this._focusLength = null;
		this._scale = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aZ, aFocusLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("focusLength", aFocusLength);
		return newNode;
	};
});