/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument");
	//"use strict";
	
	//Self reference
	var PhotoshopDocument = dbm.importClass("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var NormalLayer = dbm.importClass("com.developedbyme.adobeextendscript.photoshop.items.layers.NormalLayer");
	var SmartObjectLayer = dbm.importClass("com.developedbyme.adobeextendscript.photoshop.items.layers.SmartObjectLayer");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument::_init");
		
		this.superCall();
		
		this._nativeDocument = null;
		this._layers = this.addDestroyableObject(TreeStructure.create());
		
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
	
	objectFunctions.setupLayers = function() {
		console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument::setupLayers");
		
		this._setupLayersRecursive(this._nativeDocument.layers, this._layers.getRoot());
	};
	
	objectFunctions._setupLayersRecursive = function(aLayers, aParentTreeStructureItem) {
		console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument::_setupLayersRecursive");
		
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentNativeLayer = currentArray[i];
			console.log(currentNativeLayer);
			if(currentNativeLayer instanceof ArtLayer) {
				var layerKind = currentNativeLayer.kind;
				console.log(layerKind);
				switch(layerKind) {
					case LayerKind.NORMAL:
						var newLayer = NormalLayer.create(currentNativeLayer);
						console.log(newLayer);
						aParentTreeStructureItem.addChild(newLayer.getTreeStructureItem());
						break;
					case LayerKind.SMARTOBJECT:
						var newLayer = SmartObjectLayer.create(currentNativeLayer);
						console.log(newLayer);
						aParentTreeStructureItem.addChild(newLayer.getTreeStructureItem());
						break;
					default:
						//METODO: error message
						//METODO: how to handle this
						console.log("Unknown layer kind " + layerKind);
						var newLayer = NormalLayer.create(currentNativeLayer);
						console.log(newLayer);
						aParentTreeStructureItem.addChild(newLayer.getTreeStructureItem());
						break;
				}
			}
			else if(currentNativeLayer instanceof LayerSet) {
				
			}
			else {
				//METODO: error message
				console.log("Unknown layer type");
			}
		}
	};
	
	objectFunctions.savePng = function(aPath) {
		//console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument::savePng");
		//console.log(aPath);
		
		var file = new File(aPath);
		
		var exportOptions = new ExportOptionsSaveForWeb();
		exportOptions.format = SaveDocumentType.PNG;
		
		this._nativeDocument.exportDocument(file, ExportType.SAVEFORWEB, exportOptions);
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
		//console.log("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument::create");
		
		var newPhotoshopDocument = (new ClassReference()).init();
		
		newPhotoshopDocument.setNativeDocument(aDocument);
		newPhotoshopDocument.setupLayers();
		
		return newPhotoshopDocument;
	};
});