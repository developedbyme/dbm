dbm.registerClass("com.developedbyme.utils.canvas.3d.Model3d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.3d.Model3d");
	
	var Model3d = dbm.importClass("com.developedbyme.utils.canvas.3d.Model3d");
	
	var CanvasLayer3d = dbm.importClass("com.developedbyme.utils.canvas.3d.CanvasLayer3d");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.3d.Model3d::_init");
		
		this.superCall();
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this._hierarchy = TreeStructure.create();
		this._hierarchy.ownsData = true;
		this._hierarchy.getRoot().ownsData = true;
		this.addDestroyableObject(this._hierarchy);
		var rootLayer = CanvasLayer3d.create();
		this._hierarchy.getRoot().data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(this._hierarchy.getRoot());
		
		this._identityMatrix = Matrix.createIdentity(4, 4);
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions.getLayer = function(aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data === null) {
			var newLayer = CanvasLayer3d.create();
			currentItem.data = newLayer;
			newLayer._linkRegistration_setTreeStructureItem(currentItem);
			this._graphicsUpdate.connectInput(newLayer.getProperty("graphicsUpdate"));
		}
		return currentItem.data;
	};
	
	objectFunctions.createLink = function(aFrom, aTo) {
		//console.log("com.developedbyme.utils.canvas.3d.Model3d::createLink");
		var tempArray = aFrom.split("/");
		
		var newLink = TreeStructureItemLink.create(tempArray.pop(), aTo);
		
		this._hierarchy.addItem(newLink, tempArray.join("/"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._graphicsUpdate = null;
		
		this._hierarchy = null;
		
		this.superCall();
	};
	
	/**
	 * Traces out the full structure.
	 */
	objectFunctions.debugTraceStructure = function(aResolveLinksLevel) {
		//console.log("debugTraceStructure");
		
		aResolveLinksLevel = VariableAliases.valueWithDefault(aResolveLinksLevel, 10);
		
		this._hierarchy.debugTraceStructure(aResolveLinksLevel);
	}; //End function debugTraceStructure
	
	staticFunctions.create = function() {
		//console.log("create");
		var newModel3d = (new ClassReference()).init();
		return newModel3d;
	};
});