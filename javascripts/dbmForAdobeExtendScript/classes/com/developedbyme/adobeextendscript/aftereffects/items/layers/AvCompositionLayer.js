/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer", "com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	//"use strict";
	
	//Self reference
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._animationProperties = NamedArray.create(false);
		
		this._width = this.addProperty("width", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._height = this.addProperty("height", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._blendingMode = this.addProperty("blendingMode", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer::setupItem");
		
		this.superCall(aNativeItem);
		
		this._width.setupExternalObject(aNativeItem, "width");
		this._height.setupExternalObject(aNativeItem, "height");
		this._blendingMode.setupExternalObject(aNativeItem, "blendingMode");
		
		console.log(aNativeItem.name, aNativeItem.nullLayer);
		
		return this;
	};
	
	objectFunctions.getSource = function() {
		return this._nativeItem.source;
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
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer::create");
		//console.log(aNativeItem);
		
		var newAvCompositionLayer = (new ClassReference()).init();
		
		newAvCompositionLayer.setupItem(aNativeItem);
		
		return newAvCompositionLayer;
	};
});