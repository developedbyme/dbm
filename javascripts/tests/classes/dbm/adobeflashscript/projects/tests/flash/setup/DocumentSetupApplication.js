/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of setting up a document in after effects.
 */
dbm.registerClass("dbm.adobeflashscript.projects.tests.flash.setup.DocumentSetupApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DocumentSetupApplication = dbm.importClass("dbm.adobeflashscript.projects.tests.flash.setup.DocumentSetupApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var FlashDocument = dbm.importClass("dbm.adobeflashscript.flash.FlashDocument");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeflashscript.projects.tests.flash.setup.DocumentSetupApplication::_init");
		
		this.superCall();
		
		this._document = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeflashscript.projects.tests.flash.setup.DocumentSetupApplication::_createPage");
		
		this._document = FlashDocument.create();
		console.log(this._document);
		
		var activeTimeline = this._document.getActiveItem();
		console.log(activeTimeline);
		
		var layers = activeTimeline.getLayers();
		console.log(layers);
		var firstLayer = layers[0];
		console.log(firstLayer.getProperty("name").getValue());
		
		var layerFrames = firstLayer.getFrames();
		console.log(layerFrames);
		var firstFrame = layerFrames[0];
		
		var firstFrameElements = firstFrame.getElements();
		console.log(firstFrameElements);
		
		var firstElement = firstFrameElements[0];
		console.log(firstElement.getElementType(), firstElement.getProperty("name").getValue(), firstElement.getProperty("x").getValue(), firstElement.getProperty("y").getValue(), firstElement.getProperty("scaleX").getValue(), firstElement.getProperty("scaleY").getValue(), firstElement.getProperty("rotation").getValue(), firstElement.getProperty("transformX").getValue(), firstElement.getProperty("transformY").getValue());
		
		var parts = firstElement.getParts();
		console.log(parts);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});