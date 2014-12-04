/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.aftereffects.items.layers.Camera", "dbm.adobeextendscript.aftereffects.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.aftereffects.items.layers.Camera");
	//"use strict";
	
	//Self reference
	var Camera = dbm.importClass("dbm.adobeextendscript.aftereffects.items.layers.Camera");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.aftereffects.items.layers.Camera::_init");
		
		this.superCall();
		
		this._treeStructureItem.setAttribute("type", "camera");
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.aftereffects.items.layers.Camera::setupItem");
		
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
		//console.log("dbm.adobeextendscript.aftereffects.items.layers.Camera::create");
		//console.log(aNativeItem);
		
		var newCamera = (new ClassReference()).init();
		
		newCamera.setupItem(aNativeItem);
		
		return newCamera;
	};
});