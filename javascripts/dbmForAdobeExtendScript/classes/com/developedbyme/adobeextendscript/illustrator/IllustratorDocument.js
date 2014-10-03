/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument");
	//"use strict";
	
	//Self reference
	var IllustratorDocument = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var LayerBaseObject = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject");
	var PathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer");
	var CompoundPathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument::_init");
		
		this.superCall();
		
		this._nativeDocument = null;
		this._layers = this.addDestroyableObject(TreeStructure.create());
		this._layers.createMissingItems = false;
		
		return this;
	};
	
	objectFunctions.getNativeDocument = function() {
		return this._nativeDocument;
	};
	
	objectFunctions.setNativeDocument = function(aNativeDocument) {
		this._nativeDocument = aNativeDocument;
		
		return this;
	};
	
	objectFunctions.getLayers = function() {
		return this._layers.getRoot().getChildren();
	};
	
	objectFunctions.getLayerTreeStructure = function() {
		return this._layers;
	};
	
	objectFunctions.getWidth = function() {
		return this._nativeDocument.width;
	};
	
	objectFunctions.getHeight = function() {
		return this._nativeDocument.height;
	};
	
	objectFunctions.setupLayers = function() {
		//console.log("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument::setupLayers");
		
		var rootTreeStructureItem = this._layers.getRoot();
		this._setupLayersRecursive(this._nativeDocument.layers, this._nativeDocument, rootTreeStructureItem);
		this._setupLayersRecursive(this._nativeDocument.pageItems, this._nativeDocument, rootTreeStructureItem);
	};
	
	objectFunctions._setupLayersRecursive = function(aLayers, aParentNativeLayer, aParentTreeStructureItem) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument::_setupLayersRecursive");
		
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNativeLayer = currentArray[i];
			if(currentNativeLayer.parent !== aParentNativeLayer) {
				continue;
			}
			
			var newLayer = null;
			
			if(currentNativeLayer.typename === "PathItem") {
				newLayer = PathLayer.create(currentNativeLayer);
			}
			else if(currentNativeLayer.typename === "CompoundPathItem") {
				newLayer = CompoundPathLayer.create(currentNativeLayer);
			}
			else {
				newLayer = LayerBaseObject.create(currentNativeLayer);
			}
			
			var newTreeStructureItem = newLayer.getTreeStructureItem();
			aParentTreeStructureItem.addChild(newTreeStructureItem);
			
			if(currentNativeLayer.typename === "Layer") {
				this._setupLayersRecursive(currentNativeLayer.layers, currentNativeLayer, newTreeStructureItem);
				this._setupLayersRecursive(currentNativeLayer.pageItems, currentNativeLayer, newTreeStructureItem);
			}
			else if(currentNativeLayer.typename === "GroupItem") {
				this._setupLayersRecursive(currentNativeLayer.pageItems, currentNativeLayer, newTreeStructureItem);
			}
			else if(currentNativeLayer.typename === "CompoundPathItem") {
				this._setupLayersRecursive(currentNativeLayer.pathItems, currentNativeLayer, newTreeStructureItem);
			}
		}
		
		//console.log("//com.developedbyme.adobeextendscript.illustrator.IllustratorDocument::_setupLayersRecursive");
	};
	
	objectFunctions._ensureFolderExists = function(aFolder) {
		if(aFolder === null || aFolder.exists) {
			return;
		}
		this._ensureFolderExists(aFolder.parent);
		aFolder.create();
	};
	
	objectFunctions.forceClose = function() {
		this._nativeDocument.close(SaveOptions.DONOTSAVECHANGES);
		this._nativeDocument = null;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._nativeDocument = null;
		this._layers = null;
		
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
	
	staticFunctions.create = function(aDocument) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument::create");
		
		var newIllustratorDocument = (new ClassReference()).init();
		
		newIllustratorDocument.setNativeDocument(aDocument);
		newIllustratorDocument.setupLayers();
		
		return newIllustratorDocument;
	};
});