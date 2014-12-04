/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.aftereffects.items.ItemBaseObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.aftereffects.items.ItemBaseObject");
	//"use strict";
	
	//Self reference
	var ItemBaseObject = dbm.importClass("dbm.adobeextendscript.aftereffects.items.ItemBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.aftereffects.items.ItemBaseObject::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.getNativeItem = function() {
		return this._nativeItem;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		
		return this;
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
		//console.log("dbm.adobeextendscript.aftereffects.items.ItemBaseObject::create");
		//console.log(aNativeItem);
		
		var newItemBaseObject = (new ClassReference()).init();
		
		newItemBaseObject.setupItem(aNativeItem);
		
		return newItemBaseObject;
	};
});