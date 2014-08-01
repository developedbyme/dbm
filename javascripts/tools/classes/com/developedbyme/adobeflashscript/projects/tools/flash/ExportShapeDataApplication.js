/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting the shape from flash.
 */
dbm.registerClass("com.developedbyme.adobeflashscript.projects.tools.flash.ExportShapeDataApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ExportShapeDataApplication = dbm.importClass("com.developedbyme.adobeflashscript.projects.tools.flash.ExportShapeDataApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var FlashDocument = dbm.importClass("com.developedbyme.adobeflashscript.flash.FlashDocument");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.projects.tools.flash.ExportShapeDataApplication::_init");
		
		this.superCall();
		
		this._document = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeflashscript.projects.tools.flash.ExportShapeDataApplication::_createPage");
		
		this._document = FlashDocument.create();
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("flashFrame");
		
		var layersArray = new Array();
		exportObject.data = layersArray;
		
		var activeTimeline = this._document.getActiveItem();
		
		var currentArray = activeTimeline.getLayers();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			var currentLayerData = MetaDataObject.create();
			currentLayerData.metaData.addObject("name", currentLayer.getProperty("name").getValue());
			var elementsArray = new Array();
			currentLayerData.data = elementsArray;
			layersArray.push(currentLayerData);
			
			var currentFrame = currentLayer.getFrames()[0];
			var currentArray2 = currentFrame.getElements();
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentElement = currentArray2[j];
				var currentElementData = MetaDataObject.create();
				currentElementData.metaData.addObject("type", currentElement.getElementType());
				elementsArray.push(currentElementData);
				
				var partsArray = new Array();
				currentElementData.data = partsArray;
				this._exportParts(currentElement.getParts(), partsArray);
			}
		}
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		console.log(encodedXml);
		
		var saveFileUrl = fl.browseForFileURL("save", "Save shape data", "XML Document (*.xml)", "xml");
		if(saveFileUrl !== null) {
			FLfile.write(saveFileUrl, encodedXml);
		}
	};
	
	objectFunctions._exportParts = function(aPartsArray, aReturnArray) {
		var currentArray = aPartsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPart = currentArray[i];
			var currentPartData = MetaDataObject.create();
			//METODO: does this needs to be it's own structure
			currentPartData.data = {"curve": currentPart.curve, "holes": currentPart.holes, "strokeStyle": null, "fillStyle": currentPart.fillStyle};
			aReturnArray.push(currentPartData);
		}
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});