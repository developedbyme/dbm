dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	var FocusLengthFromFovNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode::init");
		
		this.superCall();
		
		this._fov = this.createProperty("fov", 0.25*Math.PI);
		this._viewLength = this.createProperty("viewLength", 640);
		this._focusLength = this.createProperty("focusLength", 0);
		
		this.createUpdateFunction("default", this._update, [this._fov, this._viewLength], [this._focusLength]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode::_update");
		
		var fov = this._fov.getValueWithoutFlow();
		var viewLength = this._viewLength.getValueWithoutFlow();
		
		this._focusLength.setValueWithFlow(0.5*viewLength*Math.tan(0.5*(Math.PI-fov)), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._fov = null;
		this._viewLength = null;
		this._focusLength = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aFov, aViewLength) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("fov", aFov);
		newNode.setPropertyInputWithoutNull("viewLength", aViewLength);
		return newNode;
	}
});