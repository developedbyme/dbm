/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem", "com.developedbyme.adobeextendscript.aftereffects.items.ItemBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem");
	//"use strict";
	
	//Self reference
	var CompositionItem = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var LayerBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.LayerBaseObject");
	var AvCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer");
	var ShapeCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	var Camera = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.Camera");
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var ConstantConverter = dbm.importClass("com.developedbyme.adobeextendscript.utils.data.ConstantConverter");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::_init");
		
		this.superCall();
		
		this._layers = null;
		this._layersTreeStructure = this.addDestroyableObject(TreeStructure.create());
		
		this._width = this.addProperty("width", ExternalVariableProperty.createWithoutExternalObject(null));
		this._height = this.addProperty("height", ExternalVariableProperty.createWithoutExternalObject(null));
		this._duration = this.addProperty("duration", ExternalVariableProperty.createWithoutExternalObject(null));
		this._frameRate = this.addProperty("frameRate", ExternalVariableProperty.createWithoutExternalObject(null));
		
		return this;
	};
	
	objectFunctions.getBackgroundColor = function() {
		var colorArray = this._nativeItem.bgColor;
		return RgbaColor.create(colorArray[0], colorArray[1], colorArray[2]);
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::setupItem");
		
		this.superCall(aNativeItem);
		
		this._width.setupExternalObject(aNativeItem, "width");
		this._height.setupExternalObject(aNativeItem, "height");
		this._duration.setupExternalObject(aNativeItem, "duration");
		this._frameRate.setupExternalObject(aNativeItem, "frameRate");
		
		//console.log("//com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::setupItem");
		return this;
	};
	
	objectFunctions.setupLayers = function() {
		this._layers = new Array();
		
		var numberOfLayers = this._nativeItem.numLayers;
		for(var i = 1; i <= numberOfLayers; i++) { //MENOTE: count starts at 1
			var currentNativeLayer = this._nativeItem.layer(i);
			
			var currentLayer;
			
			if(currentNativeLayer instanceof ShapeLayer) {
				currentLayer = ShapeCompositionLayer.create(currentNativeLayer);
			}
			else if(currentNativeLayer instanceof AVLayer) {
				currentLayer = AvCompositionLayer.create(currentNativeLayer);
			}
			else if(currentNativeLayer instanceof CameraLayer) {
				console.log("--------------------------> Camera");
				currentLayer = Camera.create(currentNativeLayer);
			}
			else {
				currentLayer = LayerBaseObject.create(currentNativeLayer);
			}
			
			this._layers.push(currentLayer);
		}
		
		for(var i = 0; i < numberOfLayers; i++) {
			var currentLayer = this._layers[i];
			var currentParent = LayerBaseObject.selectParentByNativeParent(currentLayer, this._layers);
			
			var parentNode = (currentParent !== null) ? currentParent.getTreeStructureItem() : this._layersTreeStructure.getRoot();
			
			if(!currentLayer.isTrackMatte()) {
				parentNode.addChild(currentLayer.getTreeStructureItem());
			}
			else {
				var contentLayer = this._layers[i+1];
				
				//METODO: check that the content layer has the same parent
				var holderTreeStructureItem = TreeStructureItem.create(dbm.singletons.dbmIdManager.getNewId("group"));
				holderTreeStructureItem.setAttribute("type", "trackMatte");
				holderTreeStructureItem.setAttribute("trackMatteType", ConstantConverter.convertTrackMatteToName(contentLayer.getTrackMatteType()));
				parentNode.addChild(holderTreeStructureItem);
				
				holderTreeStructureItem.addChild(currentLayer.getTreeStructureItem());
				holderTreeStructureItem.addChild(contentLayer.getTreeStructureItem());
				
				i++;
			}
		}
	};
	
	objectFunctions.getLayers = function() {
		if(this._layers === null) {
			this.setupLayers();
		}
		
		return this._layersTreeStructure.getRoot().getChildren();
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
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.CompositionItem::create");
		//console.log(aNativeItem);
		
		var newCompositionItem = (new ClassReference()).init();
		
		newCompositionItem.setupItem(aNativeItem);
		
		return newCompositionItem;
	};
});