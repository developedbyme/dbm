/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.items.elements.GroupElementItem", "dbm.adobeflashscript.flash.items.elements.ElementItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.items.elements.GroupElementItem");
	//"use strict";
	
	//Self reference
	var GroupElementItem = dbm.importClass("dbm.adobeflashscript.flash.items.elements.GroupElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var ShapePart = dbm.importClass("dbm.adobeflashscript.flash.items.elements.ShapePart");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DataSelector = dbm.importClass("dbm.utils.data.DataSelector");
	var ColorFunctions = dbm.importClass("dbm.utils.graphics.color.ColorFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.items.elements.GroupElementItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._parts = null;
		this._elementType = "group";
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		return this;
	};
	
	objectFunctions.getParts = function() {
		return this._parts;
	};
	
	objectFunctions.setParts = function(aParts) {
		//console.log("dbm.adobeflashscript.flash.items.elements.GroupElementItem::setParts");
		
		this._parts = aParts;
		
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
		//console.log("dbm.adobeflashscript.flash.items.elements.GroupElementItem::create");
		//console.log(aPort);
		
		var newGroupElementItem = (new ClassReference()).init();
		
		newGroupElementItem.setNativeItem(aNativeItem);
		
		return newGroupElementItem;
	};
});