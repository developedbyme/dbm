/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Controller for a 2d canvas.
 */
dbm.registerClass("dbm.utils.canvas.CanvasController2d", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.CanvasController2d");
	
	//Self reference
	var CanvasController2d = dbm.importClass("dbm.utils.canvas.CanvasController2d");
	
	//Error report
	
	//Dependnecies
	var CanvasLayer2d = dbm.importClass("dbm.utils.canvas.CanvasLayer2d");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemLink");
	var CanvasRenderLayer2d = dbm.importClass("dbm.utils.canvas.CanvasRenderLayer2d");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.canvas.CanvasController2d::_init");
		
		this.superCall();
		
		this._numberOfLinksToResolve = 10;
		this._minScale = 0.001;
		
		this._canvas = this.createProperty("canvas", null);
		this._clearBeforeDrawing = true;
		this._display = this.createGhostProperty("display");
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		
		this._hierarchy = TreeStructure.create();
		this._hierarchy.ownsData = true;
		
		this._hierarchy.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._setupTreeStructureItem, [GetVariableObject.createSelectDataCommand()]));
		
		var rootNode = this._hierarchy.getRoot();
		rootNode.ownsData = true;
		rootNode.setAttribute("owner", this);
		rootNode.setAttribute("graphicsUpdate", this._graphicsUpdate);
		this.addDestroyableObject(this._hierarchy);
		var rootLayer = CanvasLayer2d.create();
		rootNode.data = rootLayer;
		rootLayer._linkRegistration_setTreeStructureItem(rootNode);
		this._graphicsUpdate.connectInput(rootLayer.getProperty("graphicsUpdate"));
		
		this.createUpdateFunction("default", this._updateFlow, [this._graphicsUpdate, this._canvas], [this._display]);
		
		return this;
	};
	
	objectFunctions.getRootLayer = function() {
		return this._hierarchy.getRoot().data;
	};
	
	objectFunctions._setupTreeStructureItem = function(aTreeStructureItem) {
		//console.log("dbm.utils.canvas.CanvasController2d::_setupTreeStructureItem");
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
		//console.log("dbm.utils.canvas.CanvasController2d::createLink");
		var tempArray = aFrom.split("/");
		
		var newLink = TreeStructureItemLink.create(tempArray.pop(), aTo);
		
		this._hierarchy.addItem(newLink, tempArray.join("/"));
	};
	
	objectFunctions.createPattern = function(aImage, aRepeat) {
		//console.log("dbm.utils.canvas.CanvasController2d::createPattern");
		
		aRepeat = VariableAliases.valueWithDefault(aRepeat, "repeat");
		
		var canvas = this._canvas.getValue();
		return canvas.getContext("2d").createPattern(aImage, aRepeat);
	};
	
	objectFunctions.getWidthOfText = function(aText, aFont) {
		//console.log("dbm.utils.canvas.CanvasController2d::getWidthOfText");
		
		var canvas = this._canvas.getValue();
		canvas.getContext("2d").font = aFont;
		return canvas.getContext("2d").measureText(aText).width;
	};
	
	objectFunctions.createLinearGradient = function(aX1, aY1, aX2, aY2, aGradient) {
		//console.log("dbm.utils.canvas.CanvasController2d::createLinearGradient");
		
		var canvas = this._canvas.getValue();
		var gradient = canvas.getContext("2d").createLinearGradient(aX1, aY1, aX2, aY2);
		aGradient.addColorStopsToCanvasGradient(gradient);
		return gradient;
	};
	
	objectFunctions.createRadialGradient = function(aX1, aY1, aRadius1, aX2, aY2, aRadius2, aGradient) {
		//console.log("dbm.utils.canvas.CanvasController2d::createLinearGradient");
		
		var canvas = this._canvas.getValue();
		var gradient = canvas.getContext("2d").createRadialGradient(aX1, aY1, aRadius1, aX2, aY2, aRadius2);
		aGradient.addColorStopsToCanvasGradient(gradient);
		return gradient;
	};
	
	objectFunctions._draw = function() {
		//console.log("dbm.utils.canvas.CanvasController2d::_draw");
		
		var canvas = this._canvas.getValueWithoutFlow();
		var currentContext = canvas.getContext("2d");
		currentContext.setTransform(1, 0, 0, 1, 0, 0);
		var currentLayer = this.getRootLayer();
		
		if(this._clearBeforeDrawing) {
			currentContext.clearRect(0, 0, canvas.width, canvas.height);
		}
		currentLayer.draw(currentContext, this._numberOfLinksToResolve);
	};
	
	objectFunctions.draw = function() {
		//console.log("dbm.utils.canvas.CanvasController2d::draw");
		this._display.update();
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.utils.canvas.CanvasController2d::_updateFlow");
		this._draw();
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