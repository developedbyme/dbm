/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Controller for a 2d canvas.
 */
dbm.registerClass("com.developedbyme.utils.canvas.CanvasController2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CanvasController2d");
	
	var CanvasController2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasController2d");
	
	var CanvasLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasLayer2d");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var CanvasRenderLayer2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasRenderLayer2d");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::_init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		this._minScale = 0.001;
		
		this._canvas = this.createProperty("canvas", null);
		this._clearBeforeDrawing = true;
		this._display = this.createGhostProperty("display");
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		
		this._hierarchy = TreeStructure.create();
		this._hierarchy.ownsData = true;
		this._hierarchy.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._setupTreeStructureItem, [GetVariableObject.createSelectDataCommand()]));
		
		var rootNode = this._hierarchy.getRoot();
		rootNode.ownsData = true;
		this.addDestroyableObject(this._hierarchy);
		var rootLayer = CanvasLayer2d.create();
		rootNode.data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(rootNode);
		
		this.createUpdateFunction("default", this._updateFlow, [this._graphicsUpdate, this._canvas], [this._display]);
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions._setupTreeStructureItem = function(aTreeStructureItem) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::_setupTreeStructureItem");
		//console.log(aTreeStructureItem.getPath());
		
		if(aTreeStructureItem.data === null) {
			var newLayer = CanvasLayer2d.create();
			aTreeStructureItem.data = newLayer;
			newLayer._linkRegistration_setTreeStructureItem(aTreeStructureItem);
			this._graphicsUpdate.connectInput(newLayer.getProperty("graphicsUpdate"));
		}
	};
	
	objectFunctions.getLayer = function(aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		
		return currentItem.data;
	};
	
	objectFunctions.createRenderLayer = function(aPath, aOffsetX, aOffsetY, aWidth, aHeight) {
		var currentItem = this._hierarchy.getItemByPath(aPath);
		if(currentItem.data === null) {
			var newLayer = CanvasRenderLayer2d.create(aOffsetX, aOffsetY, aWidth, aHeight);
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
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::createPattern");
		
		aRepeat = VariableAliases.valueWithDefault(aRepeat, "repeat");
		
		var canvas = this._canvas.getValue();
		return canvas.getContext("2d").createPattern(aImage, aRepeat);
	};
	
	objectFunctions.getWidthOfText = function(aText, aFont) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::getWidthOfText");
		
		var canvas = this._canvas.getValue();
		canvas.getContext("2d").font = aFont;
		return canvas.getContext("2d").measureText(aText).width;
	};
	
	objectFunctions.createLinearGradient = function(aX1, aY1, aX2, aY2, aGradient) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::createLinearGradient");
		
		var canvas = this._canvas.getValue();
		var gradient = canvas.getContext("2d").createLinearGradient(aX1, aY1, aX2, aY2);
		aGradient.addColorStopsToCanvasGradient(gradient);
		return gradient;
	};
	
	objectFunctions.createRadialGradient = function(aX1, aY1, aRadius1, aX2, aY2, aRadius2, aGradient) {
		//console.log("com.developedbyme.utils.canvas.CanvasController2d::createLinearGradient");
		
		var canvas = this._canvas.getValue();
		var gradient = canvas.getContext("2d").createRadialGradient(aX1, aY1, aRadius1, aX2, aY2, aRadius2);
		aGradient.addColorStopsToCanvasGradient(gradient);
		return gradient;
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
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._canvas = null;
		this._display = null;
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
	
	staticFunctions.create = function(aCanvas) {
		var newCanvasController2d = (new ClassReference()).init();
		newCanvasController2d.getProperty("canvas").setValue(aCanvas);
		return newCanvasController2d;
	};
});