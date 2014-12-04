/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer", "dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer");
	//"use strict";
	
	//Self reference
	var SmartObjectLayer = dbm.importClass("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer::setupItem");
		
		this.superCall(aNativeItem);
		
		return this;
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
		//console.log("dbm.adobeextendscript.photoshop.items.layers.SmartObjectLayer::create");
		//console.log(aNativeItem);
		
		var newSmartObjectLayer = (new ClassReference()).init();
		
		newSmartObjectLayer.setupItem(aNativeItem);
		
		return newSmartObjectLayer;
	};
});