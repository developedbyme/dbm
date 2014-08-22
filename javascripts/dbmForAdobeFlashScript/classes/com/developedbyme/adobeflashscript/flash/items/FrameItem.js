/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.FrameItem", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.FrameItem");
	//"use strict";
	
	//Self reference
	var FrameItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.FrameItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var ElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem");
	var ShapeElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.FrameItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._elements = null;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._labelType = this.addProperty("labelType", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._actionScript = this.addProperty("actionScript", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		this._tweenType = this.addProperty("tweenType", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._tweenEasing = this.addProperty("tweenEasing", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._useSingleEaseCurve = this.addProperty("useSingleEaseCurve", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._hasCustomEase = this.addProperty("hasCustomEase", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._labelType.setupExternalObject(aNativeItem, "labelType");
		this._actionScript.setupExternalObject(aNativeItem, "actionScript");
		
		this._tweenType.setupExternalObject(aNativeItem, "tweenType");
		this._tweenEasing.setupExternalObject(aNativeItem, "tweenEasing");
		this._useSingleEaseCurve.setupExternalObject(aNativeItem, "useSingleEaseCurve");
		this._hasCustomEase.setupExternalObject(aNativeItem, "hasCustomEase");
		
		return this;
	};
	
	objectFunctions.getPosition = function() {
		return this._nativeItem.startFrame;
	};
	
	objectFunctions.getDuration = function() {
		return this._nativeItem.duration;
	};
	
	objectFunctions.getElements = function() {
		return this._nativeItem.elements;
	};
	
	objectFunctions.isMotionObject = function() {
		return this._nativeItem.isMotionObject();
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
		//console.log("com.developedbyme.adobeflashscript.flash.items.FrameItem::create");
		//console.log(aPort);
		
		var newFrameItem = (new ClassReference()).init();
		
		newFrameItem.setNativeItem(aNativeItem);
		
		return newFrameItem;
	};
});