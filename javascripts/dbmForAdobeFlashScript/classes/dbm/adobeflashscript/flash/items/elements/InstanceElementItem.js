/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.adobeflashscript.flash.items.elements.InstanceElementItem", "dbm.adobeflashscript.flash.items.elements.ElementItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeflashscript.flash.items.elements.InstanceElementItem");
	//"use strict";
	
	//Self reference
	var InstanceElementItem = dbm.importClass("dbm.adobeflashscript.flash.items.elements.InstanceElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("dbm.core.objectparts.ExternalVariableProperty");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.flash.items.elements.InstanceElementItem::_init");
		
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
	
	objectFunctions.getAnimations = function() {
		return this._animations;
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
		//console.log("dbm.adobeflashscript.flash.items.elements.InstanceElementItem::create");
		//console.log(aPort);
		
		var newInstanceElementItem = (new ClassReference()).init();
		
		newInstanceElementItem.addNativeItem(aNativeItem);
		
		return newInstanceElementItem;
	};
});