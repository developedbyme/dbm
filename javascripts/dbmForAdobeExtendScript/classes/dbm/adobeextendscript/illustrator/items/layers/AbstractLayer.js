/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer", "dbm.adobeextendscript.illustrator.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer");
	//"use strict";
	
	//Self reference
	var AbstractLayer = dbm.importClass("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer::_init");
		
		this.superCall();
		
		this._hasPosition = false;
		this._x = NaN;
		this._y = NaN;
		this._width = NaN;
		this._height = NaN;
		
		return this;
	};
	
	objectFunctions._getPosition = function() {
		//console.log("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer::_getPosition");
		//console.log(this);
		
		var minX = NaN;
		var minY = NaN;
		var maxX = NaN;
		var maxY = NaN;
		
		var currentArray = this._treeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i].data;
			var currentX = currentLayer.getX();
			var currentY = currentLayer.getY();
			
			var currentMaxX = currentX+currentLayer.getWidth();
			var currentMaxY = currentY+currentLayer.getHeight();
			
			if(isNaN(minX) || currentX < minX) {
				minX = currentX;
			}
			if(isNaN(minY) || currentY < minY) {
				minY = currentY;
			}
			
			if(isNaN(maxX) || currentMaxX > maxX) {
				maxX = currentMaxX;
			}
			if(isNaN(maxY) || currentMaxY > maxY) {
				maxY = currentMaxY;
			}
		}
		
		this._x = minX;
		this._y = minY;
		this._width = maxX-minX;
		this._height = maxY-minY;
		
		this._hasPosition = true;
	};
	
	objectFunctions.getX = function() {
		if(!this._hasPosition) this._getPosition();
		return this._x;
	};
	
	objectFunctions.getY = function() {
		if(!this._hasPosition) this._getPosition();
		return this._y;
	};
	
	objectFunctions.getWidth = function() {
		if(!this._hasPosition) this._getPosition();
		return this._width;
	};
	
	objectFunctions.getHeight = function() {
		if(!this._hasPosition) this._getPosition();
		return this._height;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.illustrator.items.layers.AbstractLayer::create");
		//console.log(aNativeItem);
		
		var newAbstractLayer = (new ClassReference()).init();
		
		newAbstractLayer.setupItem(aNativeItem);
		
		return newAbstractLayer;
	};
});