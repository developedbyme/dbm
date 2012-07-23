dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode");
	
	var FocusLengthMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode::_init");
		
		this.superCall();
		
		this._focusLength = this.createProperty("focusLength", 0);
		var outputMatrix = Matrix.createIdentity(4, 4);
		outputMatrix.setValue(2, 2, 0);
		this._outputMatrix = this.createProperty("outputMatrix", outputMatrix);
		
		this.createUpdateFunction("default", this._update, [this._focusLength], [this._outputMatrix]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode::_update");
		
		var focusLength = this._focusLength.getValueWithoutFlow();
		var outputMatrix = 	this._outputMatrix.getValueWithoutFlow();
		
		outputMatrix.setValue(3, 3, 0);
		outputMatrix.setValue(3, 2, -1/focusLength);
		
		this._outputMatrix._internalFunctionality_setFlowUpdateNumber(aFlowUpdateNumber);
		//console.log(aFlowUpdateNumber, this._outputMatrix.getFlowUpdateNumber());
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._focusLength = null;
		this._outputMatrix = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aFocusLength) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode::create");
		
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("focusLength", aFocusLength);
		return newNode;
	}
});