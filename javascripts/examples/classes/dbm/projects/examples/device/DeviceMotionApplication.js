/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows device motion.
 */
dbm.registerClass("dbm.projects.examples.device.DeviceMotionApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.examples.device.DeviceMotionApplication");
	
	//Self reference
	var DeviceMotionApplication = dbm.importClass("dbm.projects.examples.device.DeviceMotionApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var DeviceMotion = dbm.importClass("dbm.utils.device.DeviceMotion");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.device.DeviceMotionApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.device.DeviceMotionApplication::_createPage");
		
		var deviceMotion = DeviceMotion.create();
		deviceMotion.startUpdating();
		
		this._createText("X", deviceMotion.getProperty("xValue"));
		this._createText("Y", deviceMotion.getProperty("yValue"));
		this._createText("Z", deviceMotion.getProperty("zValue"));
		
		this._createText("X with gravity", deviceMotion.getProperty("xWithGravityValue"));
		this._createText("Y with gravity", deviceMotion.getProperty("yWithGravityValue"));
		this._createText("Z with gravity", deviceMotion.getProperty("zWithGravityValue"));
		
		this._createText("Alpha", deviceMotion.getProperty("alphaValue"));
		this._createText("Beta", deviceMotion.getProperty("betaValue"));
		this._createText("Gamma", deviceMotion.getProperty("gammaValue"));
		
		this._createText("Interval", deviceMotion.getProperty("interval"));
	};
	
	objectFunctions._createText = function(aLabel, aProperty) {
		var body = dbm.getDocument().body;
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var holder = htmlCreator.createDiv(null, htmlCreator.createText(aLabel + ": "));
		body.appendChild(holder);
		var printText = TextElement.create(holder, true, aProperty);
		printText.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});