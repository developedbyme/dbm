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
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._frames = null;
		this._elements = new Array();
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		this._layerType = this.addProperty("layerType", ExternalVariableProperty.createWithoutExternalObject(null));
		this._animationType = this.addProperty("animationType", ExternalVariableProperty.createWithoutExternalObject(null));
		
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
		console.log("com.developedbyme.adobeflashscript.flash.items.LayerItem::setupElements");
		console.log(this.getProperty("name").getValue());
		
		var lastFrame = null;
		var lastElement = null;
		
		var currentArray = this._frames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFrame = currentArray[i];
			console.log("Frame " + currentFrame.getPosition());
			console.log(currentFrame._nativeItem.isMotionObject());
			var currentArray2 = currentFrame.getElements();
			console.log(currentArray2);
			var currentArray2Length = currentArray2.length;
			if(currentArray2Length === 1) {
				if(lastElement !== null) {
					var currentElement = lastElement;
					currentElement.setEndTime(currentFrame.getPosition()+currentFrame.getDuration());
					var currentNativeItem = currentArray2[0];
					currentElement.addNativeItem(currentNativeItem);
					
					var animations = currentElement.getAnimations();
					
					var currentTweenType = currentFrame.getProperty("tweenType").getValue();
					var lastTweenType = lastFrame.getProperty("tweenType").getValue();
					console.log(currentTweenType, lastTweenType);
					if(lastTweenType === "motion") {
						
						var lastPosition = lastFrame.getPosition();
						var lastDuration = lastFrame.getDuration();
						
						//METODO: set correct easing
						animations.getObject("x").animateValueAt(currentNativeItem.matrix.tx, lastDuration, InterpolationTypes.LINEAR, lastPosition);
						animations.getObject("y").animateValueAt(currentNativeItem.matrix.ty, lastDuration, InterpolationTypes.LINEAR, lastPosition);
						animations.getObject("rotation").animateValueAt(AngleFunctions.degreesToRadians(currentNativeItem.rotation), lastDuration, InterpolationTypes.LINEAR, lastPosition);
						animations.getObject("scaleX").animateValueAt(currentNativeItem.scaleX, lastDuration, InterpolationTypes.LINEAR, lastPosition);
						animations.getObject("scaleY").animateValueAt(currentNativeItem.scaleY, lastDuration, InterpolationTypes.LINEAR, lastPosition);
						animations.getObject("alpha").animateValueAt(0.01*currentNativeItem.colorAlphaPercent, lastDuration, InterpolationTypes.LINEAR, lastPosition);
					}
					else {
						var currentPosition = currentFrame.getPosition();
						
						animations.getObject("x").setValueAt(currentNativeItem.matrix.tx, currentPosition);
						animations.getObject("y").setValueAt(currentNativeItem.matrix.ty, currentPosition);
						animations.getObject("rotation").setValueAt(AngleFunctions.degreesToRadians(currentNativeItem.rotation), currentPosition);
						animations.getObject("scaleX").setValueAt(currentNativeItem.scaleX, currentPosition);
						animations.getObject("scaleY").setValueAt(currentNativeItem.scaleY, currentPosition);
						animations.getObject("alpha").setValueAt(0.01*currentNativeItem.colorAlphaPercent, currentPosition);
					}
				}
				else {
					var currentElement = this._createNewElement(currentArray2[0], currentFrame.getPosition(), currentFrame.getPosition()+currentFrame.getDuration(), this._elements);
					if(currentFrame.isMotionObject()) {
						console.log(">>>>>>", currentFrame._nativeItem.hasMotionPath());
						console.log(">>>>>>", currentFrame._nativeItem.getMotionObjectXML());
						
						console.log(currentFrame._nativeItem.motionTweenOrientToPath);
						console.log(currentFrame._nativeItem.motionTweenRotate);
						console.log(currentFrame._nativeItem.motionTweenRotateTimes);
						//console.log(currentFrame._nativeItem.motionTweenScale);
						console.log(currentFrame._nativeItem.motionTweenSnap);
						console.log(currentFrame._nativeItem.motionTweenSync);
						
						//METODO: add timelines
						
						lastElement = null;
					}
					else {
						lastElement = currentElement;
					}
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
			
			var animations = currentElement.getAnimations();
			animations.getObject("x").setStartValue(aNativeElement.matrix.tx);
			animations.getObject("y").setStartValue(aNativeElement.matrix.ty);
			animations.getObject("rotation").setStartValue(AngleFunctions.degreesToRadians(aNativeElement.rotation));
			animations.getObject("scaleX").setStartValue(aNativeElement.scaleX);
			animations.getObject("scaleY").setStartValue(aNativeElement.scaleY);
			animations.getObject("alpha").setStartValue(0.01*aNativeElement.colorAlphaPercent);
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