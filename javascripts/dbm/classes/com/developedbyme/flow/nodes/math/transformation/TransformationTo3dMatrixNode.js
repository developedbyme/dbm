/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode");
	
	//Self reference
	var TransformationTo3dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode");
	
	//Error report
	
	//Dependencies
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var RotationOrderTypes = dbm.importClass("com.developedbyme.constants.RotationOrderTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode::_init");
		
		this.superCall();
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._z = this.createProperty("z", 0);
		this._rotateX = this.createProperty("rotateX", 0);
		this._rotateY = this.createProperty("rotateY", 0);
		this._rotateZ = this.createProperty("rotateZ", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		this._scaleZ = this.createProperty("scaleZ", 1);
		this._rotationOrder = this.createProperty("rotationOrder", RotationOrderTypes.XYZ);
		this._outputMatrix = this.createProperty("outputMatrix", Matrix.createIdentity(4, 4));
		
		this._matrixOrder = new Array(3);
		this._tempMatrices = new Array(2);
		this._tempMatrices[0] = Matrix.createIdentity(4, 4);
		this._tempMatrices[1] = Matrix.createIdentity(4, 4);
		
		this._scaleMatrix = Matrix.createIdentity(4, 4);
		this._rotateXMatrix = Matrix.createIdentity(4, 4);
		this._rotateYMatrix = Matrix.createIdentity(4, 4);
		this._rotateZMatrix = Matrix.createIdentity(4, 4);
		
		this.createUpdateFunction("default", this._update, [this._x, this._y, this._z, this._rotateX, this._rotateY, this._rotateZ, this._scaleX, this._scaleY, this._scaleZ, this._rotationOrder], [this._outputMatrix]);
		
		return this;
	};
	
	objectFunctions._setMatrixOrder = function(aMatrix1, aMatrix2, aMatrix3) {
		this._matrixOrder[0] = aMatrix1;
		this._matrixOrder[1] = aMatrix2;
		this._matrixOrder[2] = aMatrix3;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode::_update");
		
		var rotateX = this._rotateX.getValueWithoutFlow();
		var rotateY = this._rotateY.getValueWithoutFlow();
		var rotateZ = this._rotateZ.getValueWithoutFlow();
		var rotationOrder = this._rotationOrder.getValueWithoutFlow();
		
		var theMatrix = this._outputMatrix.getValueWithoutFlow();
		
		//METODO: split this up in separate flows
		this._scaleMatrix.setValue(0, 0, this._scaleX.getValueWithoutFlow());
		this._scaleMatrix.setValue(1, 1, this._scaleY.getValueWithoutFlow());
		this._scaleMatrix.setValue(2, 2, this._scaleZ.getValueWithoutFlow());
		
		//METODO: split this up in separate flows
		this._rotateXMatrix.setValue(1, 1, Math.cos(rotateX));
		this._rotateXMatrix.setValue(2, 1, Math.sin(rotateX));
		this._rotateXMatrix.setValue(1, 2, -1*Math.sin(rotateX));
		this._rotateXMatrix.setValue(2, 2, Math.cos(rotateX));
		
		this._rotateYMatrix.setValue(0, 0, Math.cos(rotateY));
		this._rotateYMatrix.setValue(2, 0, -1*Math.sin(rotateY));
		this._rotateYMatrix.setValue(0, 2, Math.sin(rotateY));
		this._rotateYMatrix.setValue(2, 2, Math.cos(rotateY));
		
		this._rotateZMatrix.setValue(0, 0, Math.cos(rotateZ));
		this._rotateZMatrix.setValue(1, 0, Math.sin(rotateZ));
		this._rotateZMatrix.setValue(0, 1, -1*Math.sin(rotateZ));
		this._rotateZMatrix.setValue(1, 1, Math.cos(rotateZ));
		
		//METODO: split this up in separate flows
		switch(rotationOrder) {
			default:
				//METODO: error report
			case RotationOrderTypes.XYZ:
				this._setMatrixOrder(this._rotateXMatrix, this._rotateYMatrix, this._rotateZMatrix);
				break;
			case RotationOrderTypes.XZY:
				this._setMatrixOrder(this._rotateXMatrix, this._rotateZMatrix, this._rotateYMatrix);
				break;
			case RotationOrderTypes.YXZ:
				this._setMatrixOrder(this._rotateYMatrix, this._rotateXMatrix, this._rotateZMatrix);
				break;
			case RotationOrderTypes.YZX:
				this._setMatrixOrder(this._rotateYMatrix, this._rotateZMatrix, this._rotateYMatrix);
				break;
			case RotationOrderTypes.ZXY:
				this._setMatrixOrder(this._rotateZMatrix, this._rotateXMatrix, this._rotateYMatrix);
				break;
			case RotationOrderTypes.ZYX:
				this._setMatrixOrder(this._rotateZMatrix, this._rotateYMatrix, this._rotateXMatrix);
				break;
		}
		
		Matrix.multiplyMatrices(this._scaleMatrix, this._matrixOrder[0], this._tempMatrices[0]);
		Matrix.multiplyMatrices(this._tempMatrices[0], this._matrixOrder[1], this._tempMatrices[1]);
		Matrix.multiplyMatrices(this._tempMatrices[1], this._matrixOrder[2], theMatrix);
		
		theMatrix.setValue(0, 3, this._x.getValueWithoutFlow());
		theMatrix.setValue(1, 3, this._y.getValueWithoutFlow());
		theMatrix.setValue(2, 3, this._z.getValueWithoutFlow());
		
		this._outputMatrix.setFlowAsUpdated(aFlowUpdateNumber);
		//console.log(aFlowUpdateNumber, this._outputMatrix.getFlowUpdateNumber());
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._x = null;
		this._y = null;
		this._z = null;
		this._rotateX = null;
		this._rotateY = null;
		this._rotateZ = null;
		this._scaleX = null;
		this._scaleY = null;
		this._scaleZ = null;
		this._rotationOrder = null;
		this._outputMatrix = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aX, aY, aZ, aRotateX, aRotateY, aRotateZ, aScaleX, aScaleY, aScaleZ, aRotationOrder) {
		//console.log("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode::create");
		
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("x", aX);
		newNode.setPropertyInputWithoutNull("y", aY);
		newNode.setPropertyInputWithoutNull("z", aZ);
		newNode.setPropertyInputWithoutNull("rotateX", aRotateX);
		newNode.setPropertyInputWithoutNull("rotateY", aRotateY);
		newNode.setPropertyInputWithoutNull("rotateZ", aRotateZ);
		newNode.setPropertyInputWithoutNull("scaleX", aScaleX);
		newNode.setPropertyInputWithoutNull("scaleY", aScaleY);
		newNode.setPropertyInputWithoutNull("scaleZ", aScaleZ);
		newNode.setPropertyInputWithoutNull("rotationOrder", aRotationOrder);
		return newNode;
	};
});