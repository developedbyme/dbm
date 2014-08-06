/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem", "com.developedbyme.adobeflashscript.flash.items.elements.ElementItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem");
	//"use strict";
	
	//Self reference
	var InstanceElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::_init");
		
		this.superCall();
		
		this._elementType = "instance";
		
		return this;
	};
	
	objectFunctions.addNativeItem = function(aNativeItem) {
		console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::addNativeItem");
		
		this.superCall(aNativeItem);
		
		console.log(aNativeItem.libraryItem, aNativeItem.instanceType);
		
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
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::create");
		//console.log(aPort);
		
		var newInstanceElementItem = (new ClassReference()).init();
		
		newInstanceElementItem.addNativeItem(aNativeItem);
		
		return newInstanceElementItem;
	};
});