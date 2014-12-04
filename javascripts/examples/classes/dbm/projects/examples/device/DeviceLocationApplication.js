/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows device location.
 */
dbm.registerClass("dbm.projects.examples.device.DeviceLocationApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.examples.device.DeviceLocationApplication");
	
	//Self reference
	var DeviceLocationApplication = dbm.importClass("dbm.projects.examples.device.DeviceLocationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var DeviceLocation = dbm.importClass("dbm.utils.device.DeviceLocation");
	var TextElement = dbm.importClass("dbm.gui.text.TextElement");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.device.DeviceLocationApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.device.DeviceLocationApplication::_createPage");
		
		var deviceLocation = DeviceLocation.create();
		deviceLocation.startUpdating();
		
		this._accuracy = this.createProperty("accuracy", NaN);
		this._altitudeAccuracy = this.createProperty("altitudeAccuracy", NaN);
		this._heading = this.createProperty("heading", NaN);
		this._speed = this.createProperty("speed", NaN);
		this._lastUpdate = this.createProperty("lastUpdate", 0);
		
		this._createText("Has position", deviceLocation.getProperty("hasPosition"));
		this._createText("Has altitude", deviceLocation.getProperty("hasAltitude"));
		this._createText("Has direction", deviceLocation.getProperty("hasDirection"));
		
		this._createText("Latitude", deviceLocation.getProperty("latitude"));
		this._createText("Longitude", deviceLocation.getProperty("longitude"));
		this._createText("Altitude", deviceLocation.getProperty("altitude"));
		
		this._createText("Accuracy", deviceLocation.getProperty("accuracy"));
		this._createText("Altitude accuracy", deviceLocation.getProperty("altitudeAccuracy"));
		
		this._createText("Heading", deviceLocation.getProperty("heading"));
		this._createText("Speed", deviceLocation.getProperty("speed"));
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