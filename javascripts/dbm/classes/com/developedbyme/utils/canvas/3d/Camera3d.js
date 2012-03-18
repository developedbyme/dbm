/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.3d.Camera3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.Camera3d");
	
	var Camera3d = dbm.importClass("com.developedbyme.utils.canvas.3d.Camera3d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var TransformationTo3dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode");
	var FocusLengthMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode");
	var FocusLengthFromFovNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._transformationMatrix = this.createProperty("transformationMatrix", null);
		this._transformationMatrix.setAlwaysUpdateFlow(true);
		this._projectionMatrix = this.createProperty("projectionMatrix", Matrix.createIdentity(4, 4));
		this._projectionMatrix.setAlwaysUpdateFlow(true);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._transformationMatrix);
		this._graphicsUpdate.connectInput(this._projectionMatrix);
		
		this._projectionNode = null;
		
		this._transformationNode = null;
		var transformationMatrix = TransformationTo3dMatrixNode.create(0, 0, 0, 0, 0, 0, 1, 1, 1);
		this.addDestroyableObject(transformationMatrix);
		this._linkRegistration_setTransformationNode(transformationMatrix);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTransformationNode = function(aTransformationNode) {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::_linkRegistration_setTransformationNode");
		//console.log(aTransformationNode);
		this._transformationNode = aTransformationNode;
		this._transformationMatrix.connectInput(this._transformationNode.getProperty("outputMatrix"));
	};
	
	objectFunctions._linkRegistration_setProjectionNode = function(aProjectionNode) {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::_linkRegistration_setProjectionNode");
		//console.log(aTransformationNode);
		this._projectionNode = aProjectionNode;
		this._projectionMatrix.connectInput(this._projectionNode.getProperty("outputMatrix"));
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.draw = function(aContext, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::draw");
		//console.log(aNumberOfLinksToResolve);
		
		//MENOTE: don draw anything
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		
		switch(aName) {
			case "x":
			case "y":
			case "z":
			case "rotateX":
			case "rotateY":
			case "rotateZ":
			case "scaleX":
			case "scaleY":
			case "scaleZ":
				if(this._transformationNode != null) {
					return this._transformationNode.getProperty(aName);
				}
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Object " + this + " doesn't have a transform node. Can't get " + aName + ".");
				return null;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_treeStructureItem":
			case "_transformationNode":
				return false;
		}
		return this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._treeStructureItem = null;
		this._transformationMatrix = null;
		this._projectionMatrix = null;
		this._graphicsUpdate = null;
		this._transformationNode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCamera3d = (new ClassReference()).init();
		
		return newCamera3d;
	};
	
	staticFunctions.createPerspectiveProjection = function(aFocusLength) {
		var newCamera3d = (new ClassReference()).init();
		
		newCamera3d._linkRegistration_setProjectionNode(FocusLengthMatrixNode.create(aFocusLength));
		
		return newCamera3d;
	};
	
	staticFunctions.createPerspectiveProjectionFromFov = function(aFov, aViewLength) {
		var newCamera3d = (new ClassReference()).init();
		
		var focusLengthFromFovNode = FocusLengthFromFovNode.create(aFov, aViewLength);
		newCamera3d.addDestroyableObject(focusLengthFromFovNode);
		var focusLengthMatrixNode = FocusLengthMatrixNode.create(focusLengthFromFovNode.getProperty("focusLength"));
		
		newCamera3d._linkRegistration_setProjectionNode(focusLengthMatrixNode);
		
		return newCamera3d;
	};
});