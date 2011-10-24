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
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		this._minScale = 0.001;
		
		this._canvas = this.createProperty("canvas", null);
		this._clearBeforeDrawing = true;
		this._display = this.createGhostProperty("display");
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this._hierarchy = TreeStructure.create();
		var rootLayer = CanvasLayer2d.create();
		this._hierarchy.getRoot().data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(this._hierarchy.getRoot());
		
		this.createUpdateFunction("default", this._updateFlow, [this._graphicsUpdate, this._canvas], [this._display]);
		
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
			this._graphicsUpdate.connectInput(newLayer.getProperty("graphicsUpdate"));
		}
		return currentItem.data;
	};
	
	objectFunctions.createLink = function(aFrom, aTo) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::createLink");
		var tempArray = aFrom.split("/");
		
		var newLink = TreeStructureItemLink.create(tempArray.pop(), aTo);
		
		this._hierarchy.addItem(newLink, tempArray.join("/"));
	};
	
	objectFunctions.createPattern = function(aImage, aRepeat) {
		console.log("com.developedbyme.utils.canvas.CanvasController2d::createPattern");
		console.log({image: aImage});
		
		aRepeat = VariableAliases.valueWithDefault(aRepeat, "repeat");
		
		var canvas = this._canvas.getValue();
		return canvas.getContext("2d").createPattern(aImage, aRepeat);
	};
	
	objectFunctions.draw = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::draw");
		var canvas = this._canvas.getValue();
		var currentContext = canvas.getContext("2d");
		var currentLayer = this.getRootLayer();
		
		if(this._clearBeforeDrawing) {
			currentContext.clearRect(0, 0, canvas.width, canvas.height);
		}
		currentLayer.draw(currentContext, this._numberOfLinksToResolve);
		//console.log("//com.developedbyme.utils.canvas.CanvasController2d::draw");
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::_updateFlow");
		this.draw();
	};
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		
		aResolveLinksLevel = VariableAliases.valueWithDefault(aResolveLinksLevel, 10);
		
		this._hierarchy.debugTraceStructure(aResolveLinksLevel);
	}; //End function debugTraceStructure
	
	staticFunctions.create = function(aCanvas) {
		var newCanvasController2d = (new ClassReference()).init();
		newCanvasController2d.getProperty("canvas").setValue(aCanvas);
		return newCanvasController2d;
	};
});