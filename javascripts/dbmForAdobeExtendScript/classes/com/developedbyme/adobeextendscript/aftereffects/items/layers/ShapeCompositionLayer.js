/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer", "com.developedbyme.adobeextendscript.aftereffects.items.layers.AvCompositionLayer", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	//"use strict";
	
	//Self reference
	var ShapeCompositionLayer = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer::_init");
		
		this.superCall();
		
		this._shapes = this.addDestroyableObject(TreeStructure.create());
		
		return this;
	};
	
	objectFunctions.getShapes = function() {
		return this._shapes;
	};
	
	objectFunctions.setupAnimationProperties = function() {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer::setupAnimationProperties");
		ClassReference.getPropertiesForLayer(this._nativeItem, "", this._animationProperties, this._masks, this._shapes.getRoot());
		
		return this;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._shapes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.items.layers.ShapeCompositionLayer::create");
		//console.log(aNativeItem);
		
		var newShapeCompositionLayer = (new ClassReference()).init();
		
		newShapeCompositionLayer.setupItem(aNativeItem);
		
		return newShapeCompositionLayer;
	};
});