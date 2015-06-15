/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.items.elements.ShapePart", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.items.elements.ShapePart");
	//"use strict";
	
	//Self reference
	var ShapePart = dbm.importClass("dbm.adobeflashscript.flash.items.elements.ShapePart");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.items.elements.ShapePart::_init");
		
		this.superCall();
		
		this.strokeStyle = null;
		this.fillStyle = null;
		
		this.curve = null;
		this.holes = new Array();
		
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
	
	staticFunctions.create = function() {
		//console.log("dbm.adobeflashscript.flash.items.elements.ShapePart::create");
		//console.log(aPort);
		
		var newShapePart = (new ClassReference()).init();
		
		return newShapePart;
	};
});