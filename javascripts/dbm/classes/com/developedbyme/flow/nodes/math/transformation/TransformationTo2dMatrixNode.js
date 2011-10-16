dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	var TransformationTo2dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode::init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._rotate = this.createProperty("rotate", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._outputMatrix = this.createProperty("outputMatrix", Matrix.createIdentity(3, 3));
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._rotate, this._scaleX, this._scaleY], [this._outputMatrix]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode::_update");
		
		var rotate = this._rotate.getValueWithoutFlow();
		var scaleX = this._scaleX.getValueWithoutFlow();
		var scaleY = this._scaleY.getValueWithoutFlow();
		
		var theMatrix = this._outputMatrix.getValueWithoutFlow();
		theMatrix.setValue(0, 0, Math.cos(rotate)*scaleX);
		theMatrix.setValue(1, 0, -1*Math.sin(rotate)*scaleX);
		theMatrix.setValue(0, 1, Math.sin(rotate)*scaleY);
		theMatrix.setValue(1, 1, Math.cos(rotate)*scaleY);
		theMatrix.setValue(2, 0, this._x.getValueWithoutFlow());
		theMatrix.setValue(2, 1, this._y.getValueWithoutFlow());
		
		this._outputMatrix._internalFunctionality_setFlowUpdateNumber(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._rotation = null;
		this._scaleX = null;
		this._scaleY = null;
		this._outputMatrix = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aRotate, aScaleX, aScaleY) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode::create");
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("rotate", aRotate);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		return newNode;
	}
});