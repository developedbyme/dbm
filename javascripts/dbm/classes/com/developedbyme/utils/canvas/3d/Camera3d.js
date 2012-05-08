/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.3d.Camera3d", "com.developedbyme.utils.canvas.3d.CanvasLayer3d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.Camera3d");
	
	var Camera3d = dbm.importClass("com.developedbyme.utils.canvas.3d.Camera3d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var MatrixFunctions = dbm.importClass("com.developedbyme.utils.math.MatrixFunctions");
	
	var TransformationTo3dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode");
	var FocusLengthMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthMatrixNode");
	var FocusLengthFromFovNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.FocusLengthFromFovNode");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::init");
		
		this.superCall();
		
		this._projectionMatrix = this.createProperty("projectionMatrix", Matrix.createIdentity(4, 4));
		this._projectionMatrix.setAlwaysUpdateFlow(true);
		
		this._graphicsUpdate.connectInput(this._projectionMatrix);
		
		this._projectionNode = null;
		
		this._invertedMatrix = Matrix.createIdentity(4, 4);
		
		return this;
	};
	
	objectFunctions.getCameraTransformationMatrix = function() {
		//METODO: go through all the transforms
		MatrixFunctions.getInverted4x4Matrix(this._transformationMatrix.getValue(), this._invertedMatrix);
		return this._invertedMatrix;
	};
	
	objectFunctions.getProjectionMatrix = function() {
		return this._projectionMatrix.getValue();
	};
	
	objectFunctions._linkRegistration_setProjectionNode = function(aProjectionNode) {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::_linkRegistration_setProjectionNode");
		//console.log(aTransformationNode);
		this._projectionNode = aProjectionNode;
		this._projectionMatrix.connectInput(this._projectionNode.getProperty("outputMatrix"));
		this.addDestroyableObject(this._projectionNode);
	};
	
	objectFunctions.draw = function(aContext, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.3d.Camera3d::draw");
		//console.log(aNumberOfLinksToResolve);
		
		//MENOTE: don't draw anything
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		
		switch(aName) {
			case "focusLength":
			case "fov":
			case "viewLength":
				if(this._projectionNode != null) {
					return this._projectionNode.getProperty(aName);
				}
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getProperty", "Object " + this + " doesn't have a projection node. Can't get " + aName + ".");
				return null;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._projectionNode = null;
		this._projectionMatrix = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCamera3d = (new ClassReference()).init();
		
		newCamera3d.getProperty("projectionMatrix").getValue().setValue(2, 2, 0);
		
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