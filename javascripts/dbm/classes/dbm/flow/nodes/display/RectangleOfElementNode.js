/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.display.RectangleOfElementNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.display.RectangleOfElementNode");
	//"use strict";
	
	var RectangleOfElementNode = dbm.importClass("dbm.flow.nodes.display.RectangleOfElementNode");
	
	var WindowForElementNode = dbm.importClass("dbm.flow.nodes.browser.WindowForElementNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	
	var Rectangle = dbm.importClass("dbm.core.data.geometry.Rectangle");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.display.RectangleOfElementNode::_init");
		
		this.superCall();
		
		this._rectangle = this.createProperty("rectangle", Rectangle.create());
		this._element = this.createProperty("element", null);
		
		this._windowForElementNode = WindowForElementNode.create(this._element);
		this.addDestroyableObject(this._windowForElementNode);
		var windowSizeNode = WindowSizeNode.create(this._windowForElementNode.getProperty("window"));
		this.addDestroyableObject(windowSizeNode);
		
		this.createUpdateFunction("default", this._update, [this._element, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height")], [this._rectangle]);
		
		return this;
	};
	
	objectFunctions.setDocumentInput = function(aProperty) {
		
		this._windowForElementNode.setPropertyInput("document", aProperty);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.display.RectangleOfElementNode::_update");
		
		var htmlElement = this._element.getValueWithoutFlow();
		
		if(htmlElement !== null) {
			
			var theRectangle = this._rectangle.getValueWithoutFlow();
			theRectangle.x = htmlElement.clientLeft;
			theRectangle.y = htmlElement.clientTop;
			
			theRectangle.width = htmlElement.clientWidth;
			theRectangle.height = htmlElement.clientHeight;
		}
		
		this._rectangle.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._rectangle = null;
		this._element = null;
		this._document = null;
		this._windowForElementNode = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aElement) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("element", aElement);
		return newNode;
	};
});