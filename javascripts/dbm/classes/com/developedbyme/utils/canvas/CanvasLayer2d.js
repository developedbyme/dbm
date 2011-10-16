/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasLayer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	var TransformationTo2dMatrixNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.TransformationTo2dMatrixNode");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._transformationMatrix = this.createProperty("transformationMatrix", null);
		this._alpha = this.createProperty("alpha", 1);
		this._compositionOperation = this.createProperty("compositeOperation", null);
		
		this._linkRegistration_setTransformationNode(TransformationTo2dMatrixNode.create(0, 0, 0, 1, 1));
		
		this._mask = null;
		
		this._graphics = new Array();
		this._currentDrawingLayer = null;
		this._currentDrawingPosition = Point.create(0, 0);
		
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
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::draw");
		
		aContext.save();
		
		var alpha = this._alpha.getValue();
		var compositionOperation = this._compositionOperation.getValue();
		
		aContext.globalAlpha = aContext.globalAlpha*alpha;
		if(compositionOperation != null) {
			aContext.globalCompositeOperation = compositionOperation;
		}
		
		var transformationMatrix = this._transformationMatrix.getValue();
		
		aContext.transform(transformationMatrix.getValue(0, 0), transformationMatrix.getValue(1, 0), transformationMatrix.getValue(0, 1), transformationMatrix.getValue(1, 1), transformationMatrix.getValue(2, 0), transformationMatrix.getValue(2, 1));
		//METODO: draw mask
		
		this._drawGraphics(aContext);
		this._drawChildren(aContext, this._treeStructureItem.getChildren());
		
		aContext.restore();
	};
	
	objectFunctions._drawGraphics = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_drawGraphics");
		
		var currentArray = this._graphics;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGraphics = currentArray[i];
			currentGraphics.draw(aContext);
		}
	};
	
	objectFunctions._drawChildren = function(aContext, aChildren) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::_drawChildren");
		//console.log(aChildren);
		
		var currentArray = aChildren;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			if(currentChild.isLink()) {
				currentChild = this._treeStructureItem.getRoot().getItemByPath(currentChild.link, currentChild);
			}
			if(currentChild.data != null) {
				currentChild.data.draw(aContext);
			}
			else {
				this._drawChildren(aContext, currentChild.getChildren());
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
		if(lastDrawingLayer != null) {
			this._currentDrawingLayer.strokeStyle = lastDrawingLayer.strokeStyle;
		}
		this._graphics.push(this._currentDrawingLayer);
		return this._currentDrawingLayer;
	};
	
	objectFunctions.setFillStyle = function(aStyle) {
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		if(currentDrawingLayer.hasCurves()) {
			currentDrawingLayer = this._createNewCurrentDrawingLayer();
		}
		currentDrawingLayer.fillStyle = aStyle;
	};
	
	objectFunctions.setStrokeStyle = function(aLineWidth, aStyle, aLineCap, aLineJoin, aMiterLimit) {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::setStrokeStyle");
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		if(currentDrawingLayer.hasCurves()) {
			currentDrawingLayer = this._createNewCurrentDrawingLayer();
		}
		currentDrawingLayer.strokeStyle = aStyle;
		//METODO: set other properties
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
	
	staticFunctions.create = function() {
		var newCanvasLayer2d = (new ClassReference()).init();
		
		return newCanvasLayer2d;
	};
});