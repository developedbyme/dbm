/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem", "com.developedbyme.adobeextendscript.aftereffects.items.ItemBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem");
	//"use strict";
	
	//Self reference
	var CompositionItem = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::_init");
		
		this.superCall();
		
		this._layers = null;
		
		return this;
	};
	
	objectFunctions.setupLayers = function() {
		this._layers = new Array();
		
		var numberOfLayers = this._nativeItem.numLayers;
		for(var i = 1; i <= numberOfLayers; i++) { //MENOTE: count starts at 1
			var currentLayer = this._nativeItem.layer(i);
			this._layers.push(currentLayer);
		}
	};
	
	objectFunctions.getLayers = function() {
		if(this._layers === null) {
			this.setupLayers();
		}
		
		return this._layers;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeItem = null;
		
		this.superCall();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		/*
		switch(aName) {
			case "":
				return true;
		}
		*/
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::create");
		//console.log(aPort);
		
		var newCompositionItem = (new ClassReference()).init();
		
		newCompositionItem.setupItem(aNativeItem);
		
		return newCompositionItem;
	};
});