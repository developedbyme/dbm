/**
 * A layer in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasLayer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasLayer2d::init");
		
		this.superCall();
		
		this._treeStructureItem = null;
		
		this._x = this.createProperty("x", 0);
		this._y = this.createProperty("y", 0);
		this._rotation = this.createProperty("rotation", 0);
		this._scaleX = this.createProperty("scaleX", 1);
		this._scaleY = this.createProperty("scaleY", 1);
		
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
	
	staticFunctions.create = function(aCanvas) {
		var newCanvasLayer2d = (new ClassReference()).init();
		
		return newCanvasLayer2d;
	};
});