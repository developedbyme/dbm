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
	var ElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ElementItem");
	var ShapeElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem");
	var GroupElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.GroupElementItem");
	var InstanceElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.InstanceElementItem");
	
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
		this._elements = new Array();
		
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
	
	objectFunctions.setupElements = function() {
		
		var lastFrame = null;
		var lastElement = null;
		var activeElements = new Array();
		var nextActiveElements = new Array();
		
		var currentArray = this._frames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFrame = currentArray[i];
			var currentArray2 = currentFrame.getElements();
			var currentArray2Length = currentArray2.length;
			if(currentArray2Length === 1) {
				if(lastElement !== null) {
					var currentElement = lastElement;
					currentElement.setEndTime(currentFrame.getPosition()+currentFrame.getDuration());
					currentElement.addNativeItem(currentArray2[0]);
				}
				else {
					lastElement = this._createNewElement(currentArray2[0], currentFrame.getPosition(), currentFrame.getPosition()+currentFrame.getDuration(), this._elements);
				}
			}
			else {
				for(var j = 0; j < currentArray2Length; j++) {
					this._createNewElement(currentArray2[j], currentFrame.getPosition(), currentFrame.getPosition()+currentFrame.getDuration(), this._elements);
				}
				lastElement = null;
			}
			lastFrame = currentFrame;
		}
	};
	
	objectFunctions._createNewElement = function(aNativeElement, aStartTime, aEndTime, aReturnArray) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::_createNewElement");
		//console.log(aNativeElement);
		//console.log(aNativeElement.elementType);
		
		var currentElement;
		if(aNativeElement.elementType === "shape" && !aNativeElement.isGroup) {
			currentElement = ShapeElementItem.create(aNativeElement);
		}
		else if(aNativeElement.elementType === "shape" && aNativeElement.isGroup) {
			currentElement = GroupElementItem.create(aNativeElement);
			var partsArray = new Array();
			this._createElementForElements(aNativeElement.members, aStartTime, aEndTime, partsArray);
			currentElement.setParts(partsArray);
		}
		else if(aNativeElement.elementType === "instance") {
			currentElement = InstanceElementItem.create(aNativeElement);
		}
		else {
			currentElement = ElementItem.create(aNativeElement);
		}
		currentElement.setStartTime(aStartTime);
		currentElement.setEndTime(aEndTime);
		aReturnArray.push(currentElement);
		
		return currentElement;
	};
	
	objectFunctions._createElementForElements = function(aNativeElements, aStartTime, aEndTime, aReturnArray) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::_createElementForElements");
		
		var currentArray = aNativeElements;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._createNewElement(currentArray[i], aStartTime, aEndTime, aReturnArray);
		}
	};
	
	objectFunctions.getFrames = function() {
		return this._frames;
	};
	
	objectFunctions.getElements = function() {
		return this._elements;
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
		newLayerItem.setupElements();
		
		return newLayerItem;
	};
});