/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject");
	//"use strict";
	
	//Self reference
	var LayerBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._treeStructureItem = TreeStructureItem.create(dbm.singletons.dbmIdManager.getNewId("layer"));
		this._treeStructureItem.data = this;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		this._alpha = this.addProperty("alpha", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.getNativeItem = function() {
		return this._nativeItem;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
	};
	
	objectFunctions.getZIndex = function() {
		var returnValue = -1;
		try{
			returnValue = this._nativeItem.zOrderPosition;
		}
		catch(theError) {
			//console.log("Error getting z position for " + this._nativeItem.typename);
		}
		return returnValue;
	};
	
	objectFunctions.getX = function() {
		return this._nativeItem.position[0];
	};
	
	objectFunctions.getY = function() {
		var relativeY = this._treeStructureItem.getInheritedAttribute("owner").getPositionRelativeY();
		return relativeY-this._nativeItem.position[1];
	};
	
	objectFunctions.getWidth = function() {
		return this._nativeItem.width;
	};
	
	objectFunctions.getHeight = function() {
		return this._nativeItem.height;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject::setupItem");
		
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._alpha.setupExternalObject(aNativeItem, "opacity");
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeItem = null;
		this._treeStructureItem = null;
		this._name = null;
		this._alpha = null;
		
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
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject::create");
		//console.log(aNativeItem);
		
		var newLayerBaseObject = (new ClassReference()).init();
		
		newLayerBaseObject.setupItem(aNativeItem);
		
		return newLayerBaseObject;
	};
});