/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.items.TimelineItem", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.items.TimelineItem");
	//"use strict";
	
	//Self reference
	var TimelineItem = dbm.importClass("dbm.adobeflashscript.flash.items.TimelineItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var LayerItem = dbm.importClass("dbm.adobeflashscript.flash.items.LayerItem");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.items.TimelineItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._layers = null;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		this._name.setupExternalObject(aNativeItem, "name");
		
		return this;
	};
	
	objectFunctions.setupLayers = function() {
		this._layers = new Array();
		
		var numberOfLayers = this._nativeItem.layerCount;
		for(var i = 0; i < numberOfLayers; i++) {
			var currentNativeLayer = this._nativeItem.layers[i];
			
			var currentLayer;
			currentLayer = LayerItem.create(currentNativeLayer);
			
			this._layers.push(currentLayer);
		}
	};
	
	objectFunctions.getLayers = function() {
		if(this._layers === null) {
			this.setupLayers();
		}
		
		return this._layers;
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
		//console.log("dbm.adobeflashscript.flash.items.TimelineItem::create");
		//console.log(aPort);
		
		var newTimelineItem = (new ClassReference()).init();
		
		newTimelineItem.setNativeItem(aNativeItem);
		newTimelineItem.setupLayers();
		
		return newTimelineItem;
	};
});