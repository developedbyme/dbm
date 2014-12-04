/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.canvas.CanvasView", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.canvas.CanvasView");
	
	//Self reference
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	//Error report
	
	//Dependencies
	var CanvasController2d = dbm.importClass("dbm.utils.canvas.CanvasController2d");
	var CanvasController3d = dbm.importClass("dbm.utils.canvas.3d.CanvasController3d");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	
	//Utils
	
	//Constants
	var XmlNodeTypes = dbm.importClass("dbm.constants.XmlNodeTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.canvas.CanvasView::_init");
		
		this.superCall();
		
		this._controller = null;
		
		this._canvasWidth = this.createProperty("canvasWidth", 512);
		this._canvasHeight = this.createProperty("canvasHeight", 512);
		
		//METODO: switch this it's own update function
		this._updateFunctions.getObject("display").addInputConnection(this._canvasWidth);
		this._updateFunctions.getObject("display").addInputConnection(this._canvasHeight);
		
		return this;
	};
	
	objectFunctions.setElementAsSized = function() {
		
		this.superCall();
		
		this._canvasWidth.connectInput(this.getProperty("width"));
		this._canvasHeight.connectInput(this.getProperty("height"));
		
		return this;
	};
	
	objectFunctions.setCanvasSizeToSizeOfElement = function() {
		var sizeOfElementNode = this.addDestroyableObject(SizeOfElementNode.create());
		
		sizeOfElementNode.getProperty("element").connectInput(this.getProperty("element"));
		this._canvasWidth.connectInput(sizeOfElementNode.getProperty("width"));
		this._canvasHeight.connectInput(sizeOfElementNode.getProperty("height"));
	};
	
	objectFunctions.setController = function(aController) {
		//console.log("dbm.gui.canvas.CanvasView::setController");
		
		this._controller = aController;
		this._controller.setPropertyInput("canvas", this._element);
		this._controller.getProperty("graphicsUpdate").connectInput(this._display);
		
		return this;
	};
	
	objectFunctions.getController = function() {
		//console.log("dbm.gui.canvas.CanvasView::getController");
		
		return this._controller;
	};
	
	objectFunctions.setDocumentInput = function(aProperty) {
		
		this._sizeOfElementNode.setDocumentInput(aProperty);
		
		return this;
	};
	
	objectFunctions._updateDisplayFlow = function(aFlowUpdateNumber) {
		//console.log("dbm.gui.canvas.CanvasView::_updateDisplayFlow");
		
		this.superCall(aFlowUpdateNumber);
		
		var element = this._element.getValueWithoutFlow();
		
		var newWidth = this._canvasWidth.getValueWithoutFlow();
		var newHeight = this._canvasHeight.getValueWithoutFlow();
		//console.log(newWidth, newHeight);
		
		if(newWidth > 0) {
			element.width = newWidth;
		}
		if(newHeight > 0) {
			element.height = newHeight;
		}
	};
	
	objectFunctions.update = function() {
		//console.log("dbm.gui.canvas.CanvasView::update");
		this._display.update();
		this._controller.getProperty("display").update();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_controller":
				return false;
		}
		return this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._controller = null;
		this._display = null;
		this._canvasWidth = null;
		this._canvasHeight = null;
		
		this.superCall();
	};
	
	staticFunctions.set2dControllerToView = function(aView) {
		var canvasController = CanvasController2d.create();
		aView.setController(canvasController);
		aView.addDestroyableObject(canvasController);
		
		return aView;
	};
	
	staticFunctions.set3dControllerToView = function(aView) {
		var canvasController = CanvasController3d.create();
		aView.setController(canvasController);
		aView.addDestroyableObject(canvasController);
		
		return aView;
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aContextType, aAttributes) {
		var newView = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newView.setElement(htmlCreator.createNode("canvas", aAttributes));
		newView.setCanvasSizeToSizeOfElement(); //MENOTE: this shouldn't be here
		newView.getProperty("display").startUpdating(); //MENOTE: this shouldn't be here
		
		//MENOTE: this should move out to another class so that the controllers doesn't have to be imported
		switch(aContextType) {
			case "2d":
				ClassReference.set2dControllerToView(newView);
				break;
			case "3d":
				ClassReference.set3dControllerToView(newView);
				break;
			default:
				//METODO: error message
				break;
		}
		newView.setParent(theParent);
		if(aAddToParent !== false) {
			newView.addToDom();
		}
		
		return newView;
	};
});