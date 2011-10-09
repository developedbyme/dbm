/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasLayer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
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
		
		return this;
	};
	
	objectFunctions._linkRegistration_setTreeStructureItem = function(aItem) {
		this._treeStructureItem = aItem;
	};
	
	objectFunctions.draw = function(aContext) {
		
	};
	
	objectFunctions.setFillStyle = function(aStyle) {
		
	};
	
	objectFunctions.setStrokeStyle = function(aLineWidth, aStyle, aLineCap, aLineJoin, aMiterLimit) {
		
	};
	
	staticFunctions.create = function() {
		var newCanvasLayer2d = (new ClassReference()).init();
		
		return newCanvasLayer2d;
	};
});