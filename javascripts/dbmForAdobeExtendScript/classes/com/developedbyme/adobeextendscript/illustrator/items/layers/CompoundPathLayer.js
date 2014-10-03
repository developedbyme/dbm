/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer", "com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	//"use strict";
	
	//Self reference
	var CompoundPathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer::setupItem");
		
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
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer::create");
		//console.log(aNativeItem);
		
		var newCompoundPathLayer = (new ClassReference()).init();
		
		newCompoundPathLayer.setupItem(aNativeItem);
		
		return newCompoundPathLayer;
	};
});