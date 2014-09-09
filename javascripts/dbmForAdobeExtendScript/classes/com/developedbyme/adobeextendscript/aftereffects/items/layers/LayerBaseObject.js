/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject");
	//"use strict";
	
	//Self reference
	var LayerBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject");
	
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
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._animationProperties = NamedArray.create(false);
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._inPoint = this.addProperty("inPoint", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._outPoint = this.addProperty("outPoint", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		
		return this;
	};
	
	objectFunctions.getAnimationProperties = function() {
		return this._animationProperties;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::setupItem");
		
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._inPoint.setupExternalObject(aNativeItem, "inPoint");
		this._outPoint.setupExternalObject(aNativeItem, "outPoint");
		
		return this;
	};
	
	objectFunctions.setupAnimationProperties = function() {
		ClassReference.getPropertiesForLayer(this._nativeItem, "", this._animationProperties);
		
		return this;
	};
	
	staticFunctions.getPropertiesForLayer = function(aLayer, aPrefix, aReturnArray) {
		
		var numberOfProperties = aLayer.numProperties;
		
		for(var i = 1; i <= numberOfProperties; i++) { //MENOTE: count starts at 1
			var currentProperty = aLayer.property(i);
			var currentName = StringFunctions.convertToCamelCase(currentProperty.name);
			//METODO: take care of mask properties
			if(currentProperty instanceof PropertyGroup || currentProperty instanceof MaskPropertyGroup) {
				this.getPropertiesForLayer(currentProperty, aPrefix + currentName + "/", aReturnArray);
			}
			else {
				//console.log(aPrefix + currentName);
				aReturnArray.addObject(aPrefix + currentName, currentProperty);
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeItem = null;
		
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
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::create");
		//console.log(aPort);
		
		var newLayerBaseObject = (new ClassReference()).init();
		
		newLayerBaseObject.setupItem(aNativeItem);
		
		return newLayerBaseObject;
	};
});