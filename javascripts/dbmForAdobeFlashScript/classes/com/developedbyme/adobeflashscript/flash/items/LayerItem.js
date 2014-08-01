/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.LayerItem", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem");
	//"use strict";
	
	//Self reference
	var LayerItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.LayerItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var FrameItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.FrameItem");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._frames = null;
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._layerType = this.addProperty("layerType", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._animationType = this.addProperty("animationType", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._layerType.setupExternalObject(aNativeItem, "layerType");
		this._animationType.setupExternalObject(aNativeItem, "animationType");
		
		return this;
	};
	
	objectFunctions.setupFrames = function() {
		this._frames = new Array();
		
		var currentArray = this._nativeItem.frames;
		var currentArrayLength = this._nativeItem.frameCount;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNativeFrame = currentArray[i];
			
			var currentFrame = FrameItem.create(currentNativeFrame);
			this._frames.push(currentFrame);
			i += currentNativeFrame.duration-1;
		}
	};
	
	objectFunctions.getFrames = function() {
		return this._frames;
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
		//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::create");
		//console.log(aPort);
		
		var newLayerItem = (new ClassReference()).init();
		
		newLayerItem.setNativeItem(aNativeItem);
		newLayerItem.setupFrames();
		
		return newLayerItem;
	};
});