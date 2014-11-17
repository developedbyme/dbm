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
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	var DataSelector = dbm.importClass("com.developedbyme.utils.data.DataSelector");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._treeStructureItem = TreeStructureItem.create(dbm.singletons.dbmIdManager.getNewId("layer"));
		this._treeStructureItem.data = this;
		this._treeStructureItem.setAttribute("type", "layer");
		this._animationProperties = this.addDestroyableObject(NamedArray.create(false));
		
		this._masks = new Array();
		
		this._name = this.addProperty("name", ExternalVariableProperty.createWithoutExternalObject(null));
		this._inPoint = this.addProperty("inPoint", ExternalVariableProperty.createWithoutExternalObject(null));
		this._outPoint = this.addProperty("outPoint", ExternalVariableProperty.createWithoutExternalObject(null));
		
		this._startTime = this.addProperty("startTime", ExternalVariableProperty.createWithoutExternalObject(null));
		this._stretch = this.addProperty("stretch", ExternalVariableProperty.createWithoutExternalObject(null));
		this._active = this.addProperty("active", ExternalVariableProperty.createWithoutExternalObject(null));
		this._enabled = this.addProperty("enabled", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.getNativeItem = function() {
		return this._nativeItem;
	};
	
	objectFunctions.getTreeStructureItem = function() {
		return this._treeStructureItem;
	};
	
	objectFunctions.getAnimationProperties = function() {
		return this._animationProperties;
	};
	
	objectFunctions.getMasks = function() {
		return this._masks;
	};
	
	objectFunctions.isTrackMatte = function() {
		return this._nativeItem.isTrackMatte;
	};
	
	objectFunctions.getTrackMatteType = function() {
		return this._nativeItem.trackMatteType;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::setupItem");
		
		this._nativeItem = aNativeItem;
		
		this._name.setupExternalObject(aNativeItem, "name");
		this._inPoint.setupExternalObject(aNativeItem, "inPoint");
		this._outPoint.setupExternalObject(aNativeItem, "outPoint");
		
		this._startTime.setupExternalObject(aNativeItem, "startTime");
		this._stretch.setupExternalObject(aNativeItem, "stretch");
		this._active.setupExternalObject(aNativeItem, "active");
		this._enabled.setupExternalObject(aNativeItem, "enabled");
		
		return this;
	};
	
	objectFunctions.setupAnimationProperties = function() {
		
		//console.log(">>>>", this._nativeItem.audioEnabled, this._nativeItem.hasAudio, this._nativeItem.effectsActive, this._nativeItem.threeDLayer, this._nativeItem.timeRemapEnabled);
		
		ClassReference.getPropertiesForLayer(this._nativeItem, "", this._animationProperties, this._masks, null);
		
		return this;
	};
	
	staticFunctions.getPropertiesForLayer = function(aLayer, aPrefix, aReturnArray, aReturnMaskArray, aCurrentShape) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::getPropertiesForLayer");
		
		var numberOfProperties = aLayer.numProperties;
		
		for(var i = 1; i <= numberOfProperties; i++) { //MENOTE: count starts at 1
			var currentProperty = aLayer.property(i);
			var currentName = StringFunctions.convertToCamelCase(currentProperty.name);
			
			var holderPath = aPrefix + currentName;
			if(!currentProperty.enabled || !currentProperty.active) {
				console.log("Ignoring " + currentProperty.enabled, currentProperty.active, currentProperty.elided);
				continue;
			}
			
			if(currentProperty instanceof MaskPropertyGroup) {
				
				var maskProperties = NamedArray.create(false);
				maskProperties.addObject("path", holderPath);
				maskProperties.addObject("maskMode", currentProperty.maskMode);
				maskProperties.addObject("inverted", currentProperty.inverted);
				maskProperties.addObject("rotoBezier", currentProperty.rotoBezier);
				maskProperties.addObject("maskMotionBlur", currentProperty.maskMotionBlur);
				maskProperties.addObject("maskFeatherFalloff", currentProperty.maskFeatherFalloff);
				aReturnMaskArray.push(maskProperties);
				
				this.getPropertiesForLayer(currentProperty, holderPath + "/", aReturnArray, aReturnMaskArray, null);
			}
			else if(currentProperty instanceof PropertyGroup) {
				//console.log(aPrefix + currentName);
				
				var newShape = null;
				if(aCurrentShape !== null) {
					switch(currentProperty.matchName) {
						case "ADBE Vector Group":
							newShape = ClassReference.createChildShape(aCurrentShape, "group", holderPath);
							break;
						case "ADBE Vector Shape - Group":
							ClassReference.createChildShape(aCurrentShape, "shape", holderPath);
							break;
						case "ADBE Vector Shape - Ellipse":
							ClassReference.createChildShape(aCurrentShape, "ellipse", holderPath);
							break;
						case "ADBE Vector Graphic - Stroke":
							ClassReference.createChildShape(aCurrentShape, "stroke", holderPath);
							break;
						case "ADBE Vector Graphic - Fill":
							ClassReference.createChildShape(aCurrentShape, "fill", holderPath);
							break;
						case "ADBE Vector Stroke Dashes":
							ClassReference.createChildShape(aCurrentShape, "dashes", holderPath);
							break;
						case "ADBE Vector Filter - Trim":
							ClassReference.createChildShape(aCurrentShape, "trim", holderPath);
							break;
						case "ADBE Vector Filter - Repeater":
							ClassReference.createChildShape(aCurrentShape, "repeater", holderPath);
							break;
						case "ADBE Root Vectors Group":
						case "ADBE Vectors Group":
							newShape = aCurrentShape;
							break;
						default:
							//MENOTE: do nothing
							console.log("Shape recursion not specified for " + currentProperty.matchName);
						case "ADBE Mask Parade":
						case "ADBE Effect Parade":
						case "ADBE Transform Group":
						case "ADBE Vector Transform Group":
						case "ADBE Vector Materials Group":
						case "ADBE Layer Styles":
						case "ADBE Extrsn Options Group": //MENOTE: this is mispelled in the program
						case "ADBE Material Options Group":
						case "ADBE Audio Group":
							break;
					}
				}
				
				ClassReference.getPropertiesForLayer(currentProperty, holderPath + "/", aReturnArray, aReturnMaskArray, newShape);
			}
			else {
				//console.log(aPrefix + currentName);
				aReturnArray.addObject(holderPath, currentProperty);
			}
		}
	};
	
	staticFunctions.createChildShape = function(aParent, aType, aPath) {
		var newShape = aParent.getRoot().getItemByPath(dbm.singletons.dbmIdManager.getNewId(aType), aParent);
		newShape.setAttribute("type", aType);
		newShape.data = aPath;
		
		return newShape;
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
		//console.log(aNativeItem);
		
		var newLayerBaseObject = (new ClassReference()).init();
		
		newLayerBaseObject.setupItem(aNativeItem);
		
		return newLayerBaseObject;
	};
	
	staticFunctions.selectParentByNativeParent = function(aLayer, aSearchArray) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject::selectParentByNativeParent");
		//console.log(aLayer, aLayer.getNativeItem());
		
		var nativeParentLayer = aLayer.getNativeItem().parent;
		if(nativeParentLayer === null) {
			return null;
		}
		
		var parentMatchValue = StaticVariableObject.createCommand(nativeParentLayer);
		var parentSelector = CallFunctionObject.createFunctionOnObjectCommand(SelectBaseObjectObject.createCommand(), "getNativeItem", []);
		
		return DataSelector.getFirstEqualMatch(parentMatchValue, parentSelector, aSearchArray);
	};
});