/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.3d.CanvasLayer3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d");
	
	var CanvasLayer3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasLayer3d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var TransformationTo3dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo3dMatrixNode");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d::init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._transformationMatrix = this.createProperty("transformationMatrix", null);
		this._transformationMatrix.setAlwaysUpdateFlow(true);
		this._alpha = this.createProperty("alpha", 1);
		this._compositionOperation = this.createProperty("compositeOperation", null);
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._transformationMatrix);
		this._graphicsUpdate.connectInput(this._alpha);
		this._graphicsUpdate.connectInput(this._compositionOperation);
		
		var transformationMatrix = TransformationTo3dMatrixNode.create(0, 0, 0, 0, 0, 0, 1, 1, 1);
		this.addDestroyableObject(transformationMatrix);
		this._linkRegistration_setTransformationNode(transformationMatrix);
		
		this._graphics = new Array();
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTransformationNode = function(aTransformationNode) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d::_linkRegistration_setTransformationNode");
		//console.log(aTransformationNode);
		this._transformationNode = aTransformationNode;
		this._transformationMatrix.connectInput(this._transformationNode.getProperty("outputMatrix"));
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.addGraphics = function(aGraphics) {
		
		this._graphicsUpdate.connectInput(aGraphics.getProperty("graphicsUpdate"));
		
		this._graphics.push(aGraphics);
	};
	
	objectFunctions.draw = function(aContext, aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d::draw");
		//console.log(aNumberOfLinksToResolve);
		
		var currentMatrix = this._transformationMatrix.getValue();
		
		var newMatrix = Matrix.create(4, 4);
		
		Matrix.multiplyMatrices(aCurrentMatrix, currentMatrix, newMatrix);
		
		console.log(aCurrentMatrix.toString(), newMatrix.toString());
		
		this._drawGraphicsAndChildren(aContext, newMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve);
		
		//METODO: reuse maticeies
		newMatrix.destroy();
	};
	
	objectFunctions._drawGraphicsAndChildren = function(aContext, aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve) {
		this._drawGraphics(aContext, aCurrentMatrix, aPerspectiveMatrix);
		this._drawChildren(aContext, this._treeStructureItem.getChildren(), aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve);
	};
	
	objectFunctions._drawGraphics = function(aContext, aCurrentMatrix, aPerspectiveMatrix) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d::_drawGraphics");
		//console.log(this._graphics);
		
		var currentArray = this._graphics;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGraphics = currentArray[i];
			currentGraphics.draw(aContext, aPerspectiveMatrix, aCurrentMatrix);
		}
	};
	
	objectFunctions._drawChildren = function(aContext, aChildren, aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.3d.CanvasLayer3d::_drawChildren");
		//console.log(aNumberOfLinksToResolve);
		
		var currentArray = aChildren;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			var linkCountDown = 0;
			if(currentChild.isLink()) {
				currentChild = this._treeStructureItem.getRoot().getItemByPath(currentChild.link, currentChild);
				if(aNumberOfLinksToResolve == 0) {
					continue;
				}
				else if(aNumberOfLinksToResolve > 0) {
					linkCountDown = 1;
				}
			}
			if(currentChild.data != null) {
				currentChild.data.draw(aContext, aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve-linkCountDown);
			}
			else {
				this._drawChildren(aContext, currentChild.getChildren(), aCurrentMatrix, aPerspectiveMatrix, aNumberOfLinksToResolve-linkCountDown);
			}
		}
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
		this._alpha = null;
		this._compositionOperation = null;
		this._useMask = null;
		this._graphicsUpdate = null;
		this._transformationNode = null;
		this._graphics = null;
		this._currentDrawingPosition = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newCanvasLayer3d = (new ClassReference()).init();
		
		return newCanvasLayer3d;
	};
});