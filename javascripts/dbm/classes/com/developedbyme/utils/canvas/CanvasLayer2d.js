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
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._transformationMatrix = this.createProperty("transformationMatrix", Matrix.createIdentity());
		this._alpha = this.createProperty("alpha", 1);
		
		this._mask = null;
		
		this._graphics = new Array();
		this._currentDrawingLayer = null;
		this._currentDrawingPosition = Point.create(0, 0);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.draw = function(aContext) {
		
		//METODO: transform
		//METODO: draw mask
		//METODO: set global alpha
		
		var currentArray = this._graphics;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentGraphics = currentArray[i];
			currentGraphics.draw(aGraphics);
		}
		
		//METODO: draw children
	};
	
	objectFunctions._getCurrentDrawingLayer = function() {
		if(this._currentDrawingLayer == null) {
			return this._currentDrawingLayer;
		}
		return this._createNewDrawingLayer();
	};
	
	objectFunctions._createNewDrawingLayer = function() {
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
		
		//METODO: current curve is a curve drawer not a curve
		
		var currentDrawingLayer = this._getCurrentDrawingLayer();
		var currentCurve = currentDrawingLayer.getLastCurve();
		if(currentCurve == null || currentCurve.getCurveDegree() != 1) {
			currentCurve = BezierCurve.createWithValues(1, true, [this._currentDrawingPosition.x, this._currentDrawingPosition.y], 2);
			currentDrawingLayer.addCurve(currentCurve);
		}
		
		currentCurve.pointsArray.push(Point.create(aX, aY));
		
		this._currentDrawingPosition.x = aX;
		this._currentDrawingPosition.y = aY;
	};
	
	//METODO: curve functions
	
	staticFunctions.create = function() {
		var newCanvasLayer2d = (new ClassReference()).init();
		
		return newCanvasLayer2d;
	};
});