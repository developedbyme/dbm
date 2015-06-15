/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.items.elements.ElementItem", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.items.elements.ElementItem");
	//"use strict";
	
	//Self reference
	var ElementItem = dbm.importClass("dbm.adobeflashscript.flash.items.elements.ElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.items.elements.ElementItem::_init");
		
		this.superCall();
		
		this._frameItems = new Array();
		this._startTime = 0;
		this._endTime = 0;
		this._elementType = "unknown";
		
		return this;
	};
	
	objectFunctions.getElementType = function() {
		return this._elementType;
	};
	
	objectFunctions.getFrameItems = function() {
		return this._frameItems;
	};
	
	objectFunctions.setStartTime = function(aTime) {
		this._startTime = aTime;
		
		return this;
	};
	
	objectFunctions.setEndTime = function(aTime) {
		this._endTime = aTime;
		
		return  this;
	};
	
	objectFunctions.addNativeItem = function(aNativeItem) {
		this._frameItems.push(aNativeItem);
		
		return this;
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
		//console.log("dbm.adobeflashscript.flash.items.elements.ElementItem::create");
		//console.log(aPort);
		
		var newElementItem = (new ClassReference()).init();
		
		newElementItem.addNativeItem(aNativeItem);
		
		return newElementItem;
	};
});