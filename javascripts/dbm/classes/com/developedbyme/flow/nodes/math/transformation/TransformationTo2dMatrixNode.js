/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Node that creates a transfomration matrix in 2d from values.
 */
dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	//Self reference
	var TransformationTo2dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	//Error report
	
	//Depenencies
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode::_init");
		
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
	
	/**
	 * Updates the flow for this node.
	 *
	 * @param	aFlowUpdateNumber	Number	The integer that keeps track of when the flow was updated.
	 */
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
		
		this._outputMatrix.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._rotate = null;
		this._scaleX = null;
		this._scaleY = null;
		this._outputMatrix = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aX			Property|Number		The x positon to set to the matrix. (Optional)
	 * @param	aY			Property|Number		The y positon to set to the matrix. (Optional)
	 * @param	aRotate		Property|Number		The rotation to set to the matrix. (Optional)
	 * @param	aScaleX		Property|Number		The x scale to set to the matrix. (Optional)
	 * @param	aScaleY		Property|Number		The y scale to set to the matrix. (Optional)
	 *
	 * @return	DisplayBaseObject	The newly created object.
	 */
	staticFunctions.create = function(aX, aY, aRotate, aScaleX, aScaleY) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode::create");
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("rotate", aRotate);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		return newNode;
	};
});