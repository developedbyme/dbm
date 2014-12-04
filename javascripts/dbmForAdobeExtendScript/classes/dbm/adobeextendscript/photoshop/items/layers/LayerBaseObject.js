/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject");
	//"use strict";
	
	//Self reference
	var LayerBaseObject = dbm.importClass("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var StaticVariableObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var DataSelector = dbm.importClass("dbm.utils.data.DataSelector");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._treeStructureItem = TreeStructureItem.create(dbm.singletons.dbmIdManager.getNewId("layer"));
		this._treeStructureItem.data = this;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		this._alpha = this.addProperty("alpha", ExternalVariableProperty.createWithoutExternalObject(null));
		this._visible = this.addProperty("visible", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.getNativeItem = function() {
		return this._nativeItem;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject::setupItem");
		
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._alpha.setupExternalObject(aNativeItem, "opacity");
		this._visible.setupExternalObject(aNativeItem, "visible");
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeItem = null;
		this._treeStructureItem = null;
		this._name = null;
		
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
		//console.log("dbm.adobeextendscript.photoshop.items.layers.LayerBaseObject::create");
		//console.log(aNativeItem);
		
		var newLayerBaseObject = (new ClassReference()).init();
		
		newLayerBaseObject.setupItem(aNativeItem);
		
		return newLayerBaseObject;
	};
});