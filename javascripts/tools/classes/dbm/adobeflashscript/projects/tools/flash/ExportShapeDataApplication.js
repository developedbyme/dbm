/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Tool for exporting the shape from flash.
 */
dbm.registerClass("dbm.adobeflashscript.projects.tools.flash.ExportShapeDataApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ExportShapeDataApplication = dbm.importClass("dbm.adobeflashscript.projects.tools.flash.ExportShapeDataApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var FlashDocument = dbm.importClass("dbm.adobeflashscript.flash.FlashDocument");
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var TimelineItem = dbm.importClass("dbm.adobeflashscript.flash.items.TimelineItem");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.projects.tools.flash.ExportShapeDataApplication::_init");
		
		this.superCall();
		
		this._document = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeflashscript.projects.tools.flash.ExportShapeDataApplication::_createPage");
		
		this._document = FlashDocument.create();
		
		var exportObject = dbm.singletons.dbmXmlObjectEncoder.createExportDataObject("flashFrame");
		
		var activeTimeline = this._document.getActiveItem();
		exportObject.data = this._exportTimeline(activeTimeline);
		
		var encodedXml = dbm.singletons.dbmXmlObjectEncoder.encodeXmlFromObject(exportObject);
		
		var saveFileUrl = fl.browseForFileURL("save", "Save shape data", "XML Document (*.xml)", "xml");
		if(saveFileUrl !== null) {
			FLfile.write(saveFileUrl, encodedXml);
		}
	};
	
	objectFunctions._exportTimeline = function(aTimeline) {
		
		var returnObject = MetaDataObject.create();
		
		var layersArray = new Array();
		returnObject.data = layersArray;
		returnObject.metaData.addObject("name", aTimeline.getProperty("name").getValue());
		
		var currentArray = aTimeline.getLayers();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentLayer = currentArray[i];
			var currentLayerData = MetaDataObject.create();
			currentLayerData.metaData.addObject("name", currentLayer.getProperty("name").getValue());
			var elementsArray = new Array();
			currentLayerData.data = elementsArray;
			layersArray.push(currentLayerData);
			
			this._exportElements(currentLayer.getElements(), elementsArray);
		}
		
		return returnObject;
	};
	
	objectFunctions._exportElements = function(aElements, aReturnArray) {
		var currentArray = aElements;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentElement = currentArray[i];
			var currentElementData = MetaDataObject.create();
			
			var currentType = currentElement.getElementType();
			currentElementData.metaData.addObject("type", currentType);
			aReturnArray.push(currentElementData);
			
			if(currentType === "shape") {
				var partsArray = new Array();
				currentElementData.data = partsArray;
				this._exportParts(currentElement.getParts(), partsArray);
			}
			else if(currentType === "group") {
				var partsArray = new Array();
				currentElementData.data = partsArray;
				this._exportElements(currentElement.getParts(), partsArray);
			}
			else if(currentType === "instance") {
				var newTimeline = this._exportTimeline(TimelineItem.create(currentElement.getFrameItems()[0].libraryItem.timeline))
				currentElementData.data = {"animations": currentElement.getAnimations(), "timeline": newTimeline};
			}
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