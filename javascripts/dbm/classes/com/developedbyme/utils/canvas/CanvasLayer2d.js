/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasLayer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var CanvasMask2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasMask2d");
	var CanvasImageGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasImageGraphics2d");
	var CanvasTextGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasTextGraphics2d");
	var CanvasTextWithCustomSpacingGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasTextWithCustomSpacingGraphics2d");
	
	var TransformationTo2dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._transformationMatrix = this.createProperty("transformationMatrix", null);
		this._transformationMatrix.setAlwaysUpdateFlow(true);
		this._alpha = this.createProperty("alpha", 1);
		this._compositionOperation = this.createProperty("compositeOperation", null);
		this._useMask = this.createProperty("useMask", false);
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._transformationMatrix);
		this._graphicsUpdate.connectInput(this._alpha);
		this._graphicsUpdate.connectInput(this._compositionOperation);
		this._graphicsUpdate.connectInput(this._useMask);
		
		var transformationMatrix = TransformationTo2dMatrixNode.create(0, 0, 0, 1, 1);
		this.addDestroyableObject(transformationMatrix);
		this._linkRegistration_setTransformationNode(transformationMatrix);
		
		this._mask = null;
		
		this._graphics = new Array();
		this._currentDrawingLayer = null;
		this._currentDrawingPosition = Point.create(0, 0);
		this.addDestroyableObject(this._currentDrawingPosition);
		
		return this;
	};
	
	objectFunctions.getMask = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::getMask");
		if(this._mask == null) {
			this._mask = CanvasMask2d.create();
			this.addDestroyableObject(this._mask);
			this._graphicsUpdate.connectInput(this._mask.getProperty("graphicsUpdate"));
		}
		
		return this._mask;
	};
	
	objectFunctions.setMaskUsage = function(aUse) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::setMaskUsage");
		
		aUse = VariableAliases.valueWithDefault(aUse, true);
		
		this._useMask.setValue(aUse);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTransformationNode = function(aTransformationNode) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_linkRegistration_setTransformationNode");
		//console.log(aTransformationNode);
		this._transformationNode = aTransformationNode;
		this._transformationMatrix.connectInput(this._transformationNode.getProperty("outputMatrix"));
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.draw = function(aContext, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::draw");
		//console.log(aNumberOfLinksToResolve);
		
		aContext.save();
		
		var alpha = this._alpha.getValue();
		var compositionOperation = this._compositionOperation.getValue();
		
		aContext.globalAlpha = aContext.globalAlpha*alpha;
		if(compositionOperation != null) {
			aContext.globalCompositeOperation = compositionOperation;
		}
		
		var transformationMatrix = this._transformationMatrix.getValue();
		
		if((transformationMatrix.getValue(0, 0) == 0 && transformationMatrix.getValue(1, 0) == 0) || (transformationMatrix.getValue(0, 1) == 0 && transformationMatrix.getValue(1, 1) == 0)) {
			aContext.restore();
			return;
		}
		
		aContext.transform(transformationMatrix.getValue(0, 0), transformationMatrix.getValue(0, 1), transformationMatrix.getValue(1, 0), transformationMatrix.getValue(1, 1), transformationMatrix.getValue(2, 0), transformationMatrix.getValue(2, 1));
		if(this._mask != null && this._useMask.getValue()) {
			this._mask.draw(aContext);
		}
		
		this._drawGraphicsAndChildren(aContext, aNumberOfLinksToResolve);
		
		aContext.restore();
	};
	
	objectFunctions._drawGraphicsAndChildren = function(aContext, aNumberOfLinksToResolve) {
		this._drawGraphics(aContext);
		this._drawChildren(aContext, this._treeStructureItem.getChildren(), aNumberOfLinksToResolve);
	};
	
	objectFunctions._drawGraphics = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_drawGraphics");
		//console.log(this._graphics);
		
		var currentArray = this._graphics;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGraphics = currentArray[i];
			currentGraphics.draw(aContext);
		}
	};
	
	objectFunctions._drawChildren = function(aContext, aChildren, aNumberOfLinksToResolve) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_drawChildren");
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
				currentChild.data.draw(aContext, aNumberOfLinksToResolve-linkCountDown);
			}
			else {
				this._drawChildren(aContext, currentChild.getChildren(), aNumberOfLinksToResolve-linkCountDown);
			}
		}
	};
	
	objectFunctions._getCurrentDrawingLayer = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_getCurrentDrawingLayer");
		if(this._currentDrawingLayer != null) {
			return this._currentDrawingLayer;
		}
		return this._createNewDrawingLayer();
	};
	
	objectFunctions._createNewDrawingLayer = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_createNewDrawingLayer");
		var lastDrawingLayer = this._currentDrawingLayer;
		this._currentDrawingLayer = CanvasGraphics2d.create();
		this._graphicsUpdate.connectInput(this._currentDrawingLayer.getProperty("graphicsUpdate"));
		if(lastDrawingLayer != null) {
			this._currentDrawingLayer.getProperty("lineWidth").setValue(lastDrawingLayer.getProperty("lineWidth").getValue());
			this._currentDrawingLayer.getProperty("strokeStyle").setValue(lastDrawingLayer.getProperty("strokeStyle").getValue());
			this._currentDrawingLayer.getProperty("lineCap").setValue(lastDrawingLayer.getProperty("lineCap").getValue());
			this._currentDrawingLayer.getProperty("lineJoin").setValue(lastDrawingLayer.getProperty("lineJoin").getValue());
			this._currentDrawingLayer.getProperty("miterLimit").setValue(lastDrawingLayer.getProperty("miterLimit").getValue());
		}
		this._graphics.push(this._currentDrawingLayer);
		return this._currentDrawingLayer;
	};
	
	objectFunctions.setFillStyle = function(aStyle) {
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		if(currentDrawingLayer.hasCurves()) {
			currentDrawingLayer = this._createNewCurrentDrawingLayer();
		}
		currentDrawingLayer.getProperty("fillStyle").setValue(aStyle);
	};
	
	objectFunctions.setStrokeStyle = function(aLineWidth, aStyle, aLineCap, aLineJoin, aMiterLimit) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::setStrokeStyle");
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		if(currentDrawingLayer.hasCurves()) {
			currentDrawingLayer = this._createNewCurrentDrawingLayer();
		}
		currentDrawingLayer.getProperty("lineWidth").setValue(aLineWidth);
		currentDrawingLayer.getProperty("strokeStyle").setValue(aStyle);
		currentDrawingLayer.getProperty("lineCap").setValue(aLineCap);
		currentDrawingLayer.getProperty("lineJoin").setValue(aLineJoin);
		currentDrawingLayer.getProperty("miterLimit").setValue(aMiterLimit);
	};
	
	objectFunctions.moveTo = function(aX, aY) {
		
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		if(currentDrawingLayer.hasCurves()) {
			currentDrawingLayer = this._createNewCurrentDrawingLayer();
		}
		
		this._currentDrawingPosition.x = aX;
		this._currentDrawingPosition.y = aY;
	};
	
	objectFunctions.lineTo = function(aX, aY) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::lineTo");
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		var currentCurve = currentDrawingLayer.getLastCurve();
		if(currentCurve == null || currentCurve.getProperty("curve").getValue().getCurveDegree() != 1) {
			currentCurve = CurveDrawer2d.create(BezierCurve.createWithValues(1, true, [this._currentDrawingPosition.x, this._currentDrawingPosition.y], 2));
			currentDrawingLayer.addCurve(currentCurve);
		}
		
		var theCurve = currentCurve.getProperty("curve").getValue();
		theCurve.pointsArray.push(Point.create(aX, aY));
		
		currentCurve.getProperty("endParameter").setValue(currentCurve.getProperty("endParameter").getValue()+1);
		currentCurve.getProperty("curve").setAsDirty();
		
		this._currentDrawingPosition.x = aX;
		this._currentDrawingPosition.y = aY;
	};
	
	objectFunctions.quadraticCurveTo = function(aControlX, aControlY, aX, aY) {
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		var currentCurve = currentDrawingLayer.getLastCurve();
		if(currentCurve == null || currentCurve.getProperty("curve").getValue().getCurveDegree() != 2) {
			currentCurve = CurveDrawer2d.create(BezierCurve.createWithValues(2, true, [this._currentDrawingPosition.x, this._currentDrawingPosition.y], 2));
			currentDrawingLayer.addCurve(currentCurve);
		}
		
		var theCurve = currentCurve.getProperty("curve").getValue();
		theCurve.pointsArray.push(Point.create(aControlX, aControlY));
		theCurve.pointsArray.push(Point.create(aX, aY));
		
		currentCurve.getProperty("endParameter").setValue(currentCurve.getProperty("endParameter").getValue()+1);
		currentCurve.getProperty("curve").setAsDirty();
		
		this._currentDrawingPosition.x = aX;
		this._currentDrawingPosition.y = aY;
	};
	
	objectFunctions.bezierCurveTo = function(aControl1X, aControl1Y, aControl2X, aControl2Y, aX, aY) {
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		var currentCurve = currentDrawingLayer.getLastCurve();
		if(currentCurve == null || currentCurve.getProperty("curve").getValue().getCurveDegree() != 3) {
			currentCurve = CurveDrawer2d.create(BezierCurve.createWithValues(3, true, [this._currentDrawingPosition.x, this._currentDrawingPosition.y], 2));
			currentDrawingLayer.addCurve(currentCurve);
		}
		
		var theCurve = currentCurve.getProperty("curve").getValue();
		theCurve.pointsArray.push(Point.create(aControl1X, aControl1Y));
		theCurve.pointsArray.push(Point.create(aControl2X, aControl2Y));
		theCurve.pointsArray.push(Point.create(aX, aY));
		
		currentCurve.getProperty("endParameter").setValue(currentCurve.getProperty("endParameter").getValue()+1);
		currentCurve.getProperty("curve").setAsDirty();
		
		this._currentDrawingPosition.x = aX;
		this._currentDrawingPosition.y = aY;
	};
	
	objectFunctions.drawCurve = function(aCurve, aStartParameter, aEndParameter) {
		
		var aStartParameter = VariableAliases.valueWithDefault(aStartParameter, 0);
		var aEndParameter = VariableAliases.valueWithDefault(aEndParameter, aCurve.getMaxParameter());
		
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		
		var newCurveDrawer = CurveDrawer2d.create(aCurve);
		
		currentDrawingLayer.addCurve(newCurveDrawer);
		
		newCurveDrawer.getProperty("startParameter").setValue(aStartParameter);
		newCurveDrawer.getProperty("endParameter").setValue(aEndParameter);
		
		newCurveDrawer.getProperty("curve").setAsDirty();
		
		aCurve.getPointOnCurve(aEndParameter, this._currentDrawingPosition);
		
		return newCurveDrawer;
	};
	
	objectFunctions.maskCurve = function(aCurve, aStartParameter, aEndParameter) {
		
		var aStartParameter = VariableAliases.valueWithDefault(aStartParameter, 0);
		var aEndParameter = VariableAliases.valueWithDefault(aEndParameter, aCurve.getMaxParameter());
		
		var currentDrawingLayer = this.getMask();
		
		var newCurveDrawer = CurveDrawer2d.create(aCurve);
		
		currentDrawingLayer.addCurve(newCurveDrawer);
		
		newCurveDrawer.getProperty("startParameter").setValue(aStartParameter);
		newCurveDrawer.getProperty("endParameter").setValue(aEndParameter);
		
		newCurveDrawer.getProperty("curve").setAsDirty();
		
		return newCurveDrawer;
	};
	
	objectFunctions.closePath = function() {
		
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		currentDrawingLayer.closePath = true;
		
		currentDrawingLayer.getStartPoint(this._currentDrawingPosition);
		this.stopWorkingOnCurrentPath();
	};
	
	objectFunctions.stopWorkingOnCurrentPath = function() {
		this._createNewDrawingLayer();
	};
	
	objectFunctions.drawImage = function(aImage) {
		
		var newDrawingLayer = CanvasImageGraphics2d.create(aImage);
		this._graphicsUpdate.connectInput(newDrawingLayer.getProperty("graphicsUpdate"));
		this._graphics.push(newDrawingLayer);
		return newDrawingLayer; 
	};
	
	objectFunctions.drawText = function(aText) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::drawText");
		
		var newDrawingLayer = CanvasTextGraphics2d.create(aText);
		this._graphicsUpdate.connectInput(newDrawingLayer.getProperty("graphicsUpdate"));
		this._graphics.push(newDrawingLayer);
		return newDrawingLayer; 
	};
	
	objectFunctions.addDrawingPart = function(aPart) {
		
		this._graphicsUpdate.connectInput(aPart.getProperty("graphicsUpdate"));
		this._graphics.push(aPart);
		
	};
	
	objectFunctions.drawTextWithCustomSpacing = function(aText, aSpacing) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::drawTextWithCustomSpacing");
		
		var newDrawingLayer = CanvasTextWithCustomSpacingGraphics2d.create(aText, aSpacing);
		this._graphicsUpdate.connectInput(newDrawingLayer.getProperty("graphicsUpdate"));
		this._graphics.push(newDrawingLayer);
		return newDrawingLayer; 
	};
	
	objectFunctions.getProperty = function(aName) {
		//console.log("com.developedbyme.core.FlowBaseObject::getProperty");
		
		switch(aName) {
			case "x":
			case "y":
			case "rotate":
			case "scaleX":
			case "scaleY":
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
		var newCanvasLayer2d = (new ClassReference()).init();
		
		return newCanvasLayer2d;
	};
});