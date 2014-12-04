/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Applies a pivot to a transformation matrix.
 */
dbm.registerClass("dbm.flow.nodes.math.transformation.PivotTransformation2dNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.transformation.PivotTransformation2dNode");
	
	//Self reference
	var PivotTransformation2dNode = dbm.importClass("dbm.flow.nodes.math.transformation.PivotTransformation2dNode");
	
	//Error report
	
	//Depenencies
	var Matrix = dbm.importClass("dbm.core.data.matrices.Matrix");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.transformation.PivotTransformation2dNode::_init");
		
		this.superCall();
		
		this._pivotX = this.createProperty("pivotX", 0);
		this._pivotY = this.createProperty("pivotY", 0);
		this._transformationMatrix = this.createProperty("transformationMatrix", Matrix.createIdentity(3, 3)).setAlwaysUpdateFlow();
		this._outputMatrix = this.createProperty("outputMatrix", Matrix.createIdentity(3, 3));
		
		this._tempMatrix = this.addDestroyableObject(Matrix.createIdentity(3, 3));
		
		this.createUpdateFunction("default", this._update, [this._pivotX, this._pivotY, this._transformationMatrix], [this._outputMatrix]);
		
		return this;
	};
	
	/**
	 * Updates the flow for this node.
	 *
	 * @param	aFlowUpdateNumber	Number	The integer that keeps track of when the flow was updated.
	 */
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.transformation.PivotTransformation2dNode::_update");
		
		var pivotX = this._pivotX.getValueWithoutFlow();
		var pivotY = this._pivotY.getValueWithoutFlow();
		var transformationMatrix = this._transformationMatrix.getValueWithoutFlow();
		
		var outputMatrix = this._outputMatrix.getValueWithoutFlow();
		
		this._tempMatrix.setValue(2, 0, -1*pivotX);
		this._tempMatrix.setValue(2, 1, -1*pivotY);
		
		Matrix.multiplyMatrices(transformationMatrix, this._tempMatrix, this._outputMatrix.getValueWithoutFlow());
		
		this._outputMatrix.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._pivotX = null;
		this._pivotY = null;
		this._transformationMatrix = null;
		this._outputMatrix = null;
		
		this._tempMatrix = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aPivotX						Property|Number		The pivot x positon. (Optional)
	 * @param	aPivotY						Property|Number		The pivot y positon. (Optional)
	 * @param	aTransformationMatrix		Property|Matrix		The transformation matrix to apply. (Optional)
	 *
	 * @return	DisplayBaseObject	The newly created object.
	 */
	staticFunctions.create = function(aPivotX, aPivotY, aTransformationMatrix) {
		//console.log("dbm.flow.nodes.math.transformation.PivotTransformation2dNode::create");
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("pivotX", aPivotX);
		newNode.setPropertyInputWithoutNull("pivotY", aPivotY);
		newNode.setPropertyInputWithoutNull("transformationMatrix", aTransformationMatrix);
		return newNode;
	};
});