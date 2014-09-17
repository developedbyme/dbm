/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting all the layers in a photoshop document.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ExportLayersApplication = dbm.importClass("com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var PhotoshopDocument = dbm.importClass("com.developedbyme.adobeextendscript.photoshop.PhotoshopDocument");
	
	//Utils
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersApplication::_init");
		
		this.superCall();
		
		this._workDocument = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersApplication::_createPage");
		
		this._workDocument = PhotoshopDocument.create(app.activeDocument.duplicate("temp"));
		console.log(this._workDocument);
		
		var exportFolder = Folder.selectDialog("Select folder to export in");
		console.log(exportFolder);
		
		this._exportLayers(this._workDocument.getLayers(), this._workDocument, exportFolder.absoluteURI);
		
		this._workDocument.forceClose(); //MEDEBUG: //
	};
	
	objectFunctions._exportLayers = function(aLayers, aDocument, aFolderPath) {
		console.log("com.developedbyme.adobeextendscript.projects.tools.photoshop.ExportLayersApplication::_exportLayers");
		
		var nativeDocument = aDocument.getNativeDocument();
		
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		var initialVisibilityStates = new Array(currentArrayLength);
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayerTreeStructureItem = currentArray[i];
			var currentLayer = currentLayerTreeStructureItem.data;
			
			initialVisibilityStates[i] = currentLayer.getProperty("visible").getValue();
			currentLayer.getProperty("visible").setValue(false);
		}
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayerTreeStructureItem = currentArray[i];
			var currentLayer = currentLayerTreeStructureItem.data;
			
			currentLayer.getProperty("visible").setValue(true);
			nativeDocument.crop(currentLayer.getNativeItem().bounds);
			
			//METODO: handle name collisions
			var newPath = aFolderPath + "/" + currentLayer.getProperty("name").getValue();
			var currentFilePath = newPath + ".png";
			aDocument.savePng(currentFilePath);
			
			var children = currentLayerTreeStructureItem.getChildren();
			if(children.length > 0) {
				var newFolder = new Folder(newPath);
				newFolder.create();
				this._exportLayers(children, aDocument, newPath);
			}
			
			nativeDocument.activeHistoryState = nativeDocument.historyStates[nativeDocument.historyStates.length-2];
			currentLayer.getProperty("visible").setValue(false);
		}
	}
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});