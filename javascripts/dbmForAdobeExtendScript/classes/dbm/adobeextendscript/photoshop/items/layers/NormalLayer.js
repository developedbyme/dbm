/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.photoshop.items.layers.NormalLayer", "dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.photoshop.items.layers.NormalLayer");
	//"use strict";
	
	//Self reference
	var NormalLayer = dbm.importClass("dbm.adobeextendscript.photoshop.items.layers.NormalLayer");
	
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
		//console.log("dbm.adobeextendscript.photoshop.items.layers.NormalLayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.photoshop.items.layers.NormalLayer::setupItem");
		
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
		//console.log("dbm.adobeextendscript.photoshop.items.layers.NormalLayer::create");
		//console.log(aNativeItem);
		
		var newNormalLayer = (new ClassReference()).init();
		
		newNormalLayer.setupItem(aNativeItem);
		
		return newNormalLayer;
	};
});