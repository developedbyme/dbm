/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting specified layers from serveral photoshop documents.
 */
dbm.registerClass("dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ExportFilesApplication = dbm.importClass("dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var IllustratorDocument = dbm.importClass("dbm.adobeextendscript.illustrator.IllustratorDocument");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var LayerExporter = dbm.importClass("dbm.adobeextendscript.illustrator.utils.export.LayerExporter");
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var FileWriter = dbm.importClass("dbm.adobeextendscript.utils.file.FileWriter");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication::_init");
		
		this.superCall();
		
		this._workDocument = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication::_createPage");
		
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
			var currentDocument = IllustratorDocument.create(app.open(new File(currentFilePath)));
			this._exportDocument(currentDocument, filesToExport.getObject(currentFilePath));
			
			currentDocument.forceClose();
			//METODO: fix call to destroy
			//currentDocument.destroy();
		}
	};
	
	objectFunctions._exportDocument = function(aDocument, aOutputPath) {
		//console.log("dbm.adobeextendscript.projects.tools.illustrator.ExportFilesApplication::_exportDocument");
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("illustratorDocument");
		
		var documentMetaData = MetaDataObject.create();
		exportObject.data = documentMetaData;
		
		documentMetaData.metaData.addObject("width", aDocument.getWidth());
		documentMetaData.metaData.addObject("height", aDocument.getHeight());
		
		var exportedLayerData = TreeStructure.create();
		documentMetaData.data = exportedLayerData;
		
		LayerExporter.exportLayers(aDocument.getLayers(), exportedLayerData.getRoot(), 0, 0);
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFile = FileWriter.create(aOutputPath);
		saveFile.setData(encodedXml);
		saveFile.write();
	}
	
	objectFunctions._setupBridgeInputData = function(aInputData, aReturnArray) {
		for(var objectName in aInputData) {
			aReturnArray.addObject(objectName, aInputData[objectName]);
		}
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});