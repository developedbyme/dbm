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
	var LayerBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject");
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::_init");
		
		this.superCall();
		
		this._layers = null;
		
		this._width = this.addProperty("width", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._height = this.addProperty("height", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._duration = this.addProperty("duration", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._frameRate = this.addProperty("frameRate", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		this.superCall(aNativeItem);
		
		this._width.setupExternalObject(aNativeItem, "width");
		this._height.setupExternalObject(aNativeItem, "height");
		this._duration.setupExternalObject(aNativeItem, "duration");
		this._frameRate.setupExternalObject(aNativeItem, "frameRate");
		
		return this;
	};
	
	objectFunctions.setupLayers = function() {
		this._layers = new Array();
		
		var numberOfLayers = this._nativeItem.numLayers;
		for(var i = 1; i <= numberOfLayers; i++) { //MENOTE: count starts at 1
			var currentNativeLayer = this._nativeItem.layer(i);
			
			var currentLayer;
			if(currentNativeLayer instanceof AVLayer) {
				currentLayer = AvCompositionLayer.create(currentNativeLayer);
			}
			else {
				currentLayer = LayerBaseObject.create(currentNativeLayer);
			}
			
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