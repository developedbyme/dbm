/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.workspace.gui.parts.areas.ScrollableAreaPart", "com.developedbyme.workspace.gui.parts.BaseWorkspacePart", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.workspace.gui.parts.areas.ScrollableAreaPart");
	//"use strict";
	
	var ScrollableAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.ScrollableAreaPart");
	
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	var PositionRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.PositionRectangleNode");
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	var ValuesFromRectangleNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.ValuesFromRectangleNode");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.workspace.gui.parts.areas.ScrollableAreaPart::_init");
		
		this.superCall();
		
		this._inputAreaNode = ValuesFromRectangleNode.create();
		
		this._maskedArea = DisplayBaseObject.createNewDiv({"style": "overflow: hidden;"});
		this._maskedArea.setElementAsPositioned();
		this._maskedArea.setPropertyInput("width", this._inputAreaNode.getProperty("width"));
		this._maskedArea.setPropertyInput("height", this._inputAreaNode.getProperty("height"));
		
		this._scrollableArea = DisplayBaseObject.createDiv(this._maskedArea.getElement(), true, {"style": "position: absolute;"});
		this._scrollableArea.setElementAsPositioned();
		
		this._scrollingX = this.createProperty("scrollingX", 0);
		this._scrollingY = this.createProperty("scrollingY", 0);
		this._minScrollingX = this.createProperty("minScrollingX", 0);
		this._maxScrollingX = this.createProperty("maxScrollingX", 1);
		this._minScrollingY = this.createProperty("minScrollingY", 0);
		this._maxScrollingY = this.createProperty("maxScrollingY", 1);
		
		this._positionNode = PositionRectangleNode.create(this._inputAreaNode.getProperty("inputRectangle"), null, this._scrollingX, this._scrollingY, this._scrollingX, this._scrollingY);
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newScrollableAreaPart = (new ClassReference()).init();
		
		return newScrollableAreaPart;
		
	};
});