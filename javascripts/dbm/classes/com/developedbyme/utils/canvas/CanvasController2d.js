/**
 * Controller for a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasController2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasController2d");
	
	var CanvasController2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasController2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		this._minScale = 0.001;
		
		this._canvas = this.createProperty("canvas", null);
		this._display = this.createGhostProperty("display");
		
		this._hierarchy = TreeStructureItem.create();
		var rootLayer = CanvasLayer2d.create();
		this._hierarchy.getRoot().data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(this._hierarchy.getRoot());
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions.getLayer = function(aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data == null) {
			var newLayer = CanvasLayer2d.create();
			currentItem.data = newLayer;
			newLayer._linkRegistration_setTreeStructureItem(currentItem);
		}
		return currentItem.data;
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		var canvas = this._canvas.getValueWithoutFlow();
		var currentContext = canvas.getContext("2d");
		var currentLayer = this.getRootLayer();
		
		//METODO
	};
	
	staticFunctions.create = function(aCanvas) {
		var newCanvasController2d = (new ClassReference()).init();
		newCanvasController2d.getProperty("canvas").setValue(aCanvas);
		return newCanvasController2d;
	};
});