/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer", "dbm.adobeextendscript.illustrator.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	//"use strict";
	
	//Self reference
	var CompoundPathLayer = dbm.importClass("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.isClipping = function() {
		return this._nativeItem.pathItems[0].clipping;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer::setupItem");
		
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
		//console.log("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer::create");
		//console.log(aNativeItem);
		
		var newCompoundPathLayer = (new ClassReference()).init();
		
		newCompoundPathLayer.setupItem(aNativeItem);
		
		return newCompoundPathLayer;
	};
});