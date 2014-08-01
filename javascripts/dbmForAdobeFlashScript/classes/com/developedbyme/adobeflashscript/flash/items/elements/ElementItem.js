/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem");
	//"use strict";
	
	//Self reference
	var ElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem");
	
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
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._x = this.addProperty("x", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._y = this.addProperty("y", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._scaleX = this.addProperty("scaleX", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._scaleY = this.addProperty("scaleY", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._rotation = this.addProperty("rotation", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._transformX = this.addProperty("transformX", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._transformY = this.addProperty("transformY", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._x.setupExternalObject(aNativeItem, "x");
		this._y.setupExternalObject(aNativeItem, "y");
		this._scaleX.setupExternalObject(aNativeItem, "scaleX");
		this._scaleY.setupExternalObject(aNativeItem, "scaleY");
		this._rotation.setupExternalObject(aNativeItem, "rotation");
		this._transformX.setupExternalObject(aNativeItem, "transformX");
		this._transformY.setupExternalObject(aNativeItem, "transformY");
		
		return this;
	};
	
	objectFunctions.getElementType = function() {
		return this._nativeItem.elementType;
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
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem::create");
		//console.log(aPort);
		
		var newElementItem = (new ClassReference()).init();
		
		newElementItem.setNativeItem(aNativeItem);
		
		return newElementItem;
	};
});