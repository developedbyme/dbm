/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting specified layers from serveral photoshop documents.
 */
dbm.registerClass("dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ExportLayersFromFilesApplication = dbm.importClass("dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var PhotoshopDocument = dbm.importClass("dbm.adobeextendscript.photoshop.PhotoshopDocument");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var GetPropertyValueObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetPropertyValueObject");
	var DataSelector = dbm.importClass("dbm.utils.data.DataSelector");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication::_init");
		
		this.superCall();
		
		this._workDocument = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication::_createPage");
		
		var filesToExport = NamedArray.create(true);
		var communicationType = dbm.singletons.dbmDataManager.getData("configuration/communicationType");
		if(communicationType === "adobeBridgeTalk") {
			this._setupBridgeInputData(dbm.singletons.dbmDataManager.getData("configuration/bridge/inputValue"), filesToExport);
		}
		else {
			//METODO: error message
			console.log("Unknown communication type " + communicationType);
			return;
		}
		
		var currentArray = filesToExport.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentFilePath = currentArray[i];
			//METODO: this needs to open a new version of the file version so no changes are lost
			var currentDocument = PhotoshopDocument.create(app.open(new File(currentFilePath)));
			
			this._exportLayers(currentDocument, filesToExport.getObject(currentFilePath));
			
			currentDocument.forceClose();
			//METODO: fix call to destroy
			//currentDocument.destroy();
		}
	};
	
	objectFunctions._setupBridgeInputData = function(aInputData, aReturnArray) {
		for(var objectName in aInputData) {
			var layerArray = NamedArray.create(true);
			aReturnArray.addObject(objectName, layerArray);
			
			var currentLayers = aInputData[objectName];
			for(var layerName in currentLayers) {
				layerArray.addObject(layerName, currentLayers[layerName]);
			}
		}
	};
	
	objectFunctions._hideAllLayers = function(aLayers) {
		var currentArray = aLayers;
		var currentArrayLength = currentArray.length;
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayerTreeStructureItem = currentArray[i];
			var currentLayer = currentLayerTreeStructureItem.data;
			
			currentLayer.getProperty("visible").setValue(false);
		}
	};
	
	objectFunctions._exportLayers = function(aDocument, aExportData) {
		//console.log("dbm.adobeextendscript.projects.tools.photoshop.ExportLayersFromFilesApplication::_exportLayers");
		
		var nativeDocument = aDocument.getNativeDocument();
		
		var layers = aDocument.getLayers();
		
		this._hideAllLayers(layers);
		
		var currentNameSelector = GetPropertyValueObject.createCommand(GetVariableObject.createSelectOnBaseObjectCommand("data"), "name");
		
		var currentArray = aExportData.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayerName = currentArray[i];
			var currentLayerTreeStructureItem = DataSelector.getFirstEqualMatch(currentLayerName, currentNameSelector, layers);
			if(currentLayerTreeStructureItem === null) {
				console.log("Layer " + currentLayerName + " doesn't exist.");
				continue;
			}
			var currentLayer = currentLayerTreeStructureItem.data;
			
			currentLayer.getProperty("visible").setValue(true);
			nativeDocument.crop(currentLayer.getNativeItem().bounds);
			
			var currentFilePath = aExportData.getObject(currentLayerName);
			aDocument.savePng(currentFilePath);
			
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