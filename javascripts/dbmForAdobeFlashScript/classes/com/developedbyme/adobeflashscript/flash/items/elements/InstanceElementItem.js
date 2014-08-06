/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem", "com.developedbyme.adobeflashscript.flash.items.elements.ElementItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem");
	//"use strict";
	
	//Self reference
	var InstanceElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::_init");
		
		this.superCall();
		
		this._elementType = "instance";
		this._animations = NamedArray.create(true);
		this._animations.addObject("x", Timeline.create(0));
		this._animations.addObject("y", Timeline.create(0));
		this._animations.addObject("rotation", Timeline.create(0));
		this._animations.addObject("scaleX", Timeline.create(1));
		this._animations.addObject("scaleY", Timeline.create(1));
		this._animations.addObject("alpha", Timeline.create(1)); //METODO: alpha has offset and percentage
		
		//METODO
		this._animations.addObject("originX", Timeline.create(0));
		this._animations.addObject("originY", Timeline.create(0));
		
		return this;
	};
	
	objectFunctions.addNativeItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::addNativeItem");
		//console.log(aNativeItem.libraryItem, aNativeItem.instanceType);
		
		this.superCall(aNativeItem);
		
		if(this._frameItems.length === 1) {
			this._animations.getObject("x").setStartValue(aNativeItem.left);
			this._animations.getObject("y").setStartValue(aNativeItem.top);
			this._animations.getObject("rotation").setStartValue(aNativeItem.rotation);
			this._animations.getObject("scaleX").setStartValue(aNativeItem.scaleX);
			this._animations.getObject("scaleY").setStartValue(aNativeItem.scaleY);
			this._animations.getObject("alpha").setStartValue(0.01*aNativeItem.colorAlphaPercent);
		}
		else {
			//console.log(">>>>>>>");
			//METODO
		}
		
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
	
	staticFunctions.create = function(aNativeItem) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem::create");
		//console.log(aPort);
		
		var newInstanceElementItem = (new ClassReference()).init();
		
		newInstanceElementItem.addNativeItem(aNativeItem);
		
		return newInstanceElementItem;
	};
});