/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting all the layers in a photoshop document.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.projects.tools.illustrator.ExportActiveDocumentApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ExportActiveDocumentApplication = dbm.importClass("com.developedbyme.adobeextendscript.projects.tools.illustrator.ExportActiveDocumentApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var IllustratorDocument = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.IllustratorDocument");
	var LayerExporter = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.utils.export.LayerExporter");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var FileWriter = dbm.importClass("com.developedbyme.adobeextendscript.utils.file.FileWriter");
	
	//Utils
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.projects.tools.illustrator.ExportActiveDocumentApplication::_init");
		
		this.superCall();
		
		this._workDocument = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeextendscript.projects.tools.illustrator.ExportActiveDocumentApplication::_createPage");
		
		//METODO: solve CMYK
		this._workDocument = IllustratorDocument.create(app.activeDocument);
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("illustratorDocument");
		
		var documentMetaData = MetaDataObject.create();
		exportObject.data = documentMetaData;
		
		documentMetaData.metaData.addObject("width", this._workDocument.getWidth());
		documentMetaData.metaData.addObject("height", this._workDocument.getHeight());
		
		var exportedLayerData = TreeStructure.create();
		documentMetaData.data = exportedLayerData;
		
		LayerExporter.exportLayers(this._workDocument.getLayers(), exportedLayerData.getRoot(), 0, 0);
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFile = FileWriter.createWithPrompt("~/export.xml");
		if(saveFile !== null) {
			saveFile.setData(encodedXml);
			saveFile.write();
		}
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});