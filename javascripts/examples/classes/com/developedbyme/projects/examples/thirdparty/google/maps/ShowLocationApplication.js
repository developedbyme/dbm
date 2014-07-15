/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that shows the current device location on a map.
 */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.google.maps.ShowLocationApplication", "com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ShowLocationApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.google.maps.ShowLocationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DeviceLocation = dbm.importClass("com.developedbyme.utils.device.DeviceLocation");
	var TextElement = dbm.importClass("com.developedbyme.gui.text.TextElement");
	var CircleOverlay = dbm.importClass("com.developedbyme.thirdparty.google.maps.overlays.CircleOverlay");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.ShowLocationApplication::_init");
		
		this.superCall();
		
		this._mapView = null;
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.ShowLocationApplication::_createPage");
		
		this.superCall();
		
		var deviceLocation = DeviceLocation.create();
		deviceLocation.startUpdating();
		
		this._createText("Latitude", deviceLocation.getProperty("latitude"));
		this._createText("Longitude", deviceLocation.getProperty("longitude"));
		this._createText("Accuracy", deviceLocation.getProperty("accuracy"));
		
		this._mapView.setPropertyInput("latitude", deviceLocation.getProperty("latitude"));
		this._mapView.setPropertyInput("longitude", deviceLocation.getProperty("longitude"));
		
		this._mapView.getProperty("zoom").setValue(20);
		
		var circle = CircleOverlay.create();
		circle.setPropertyInput("latitude", deviceLocation.getProperty("latitude"));
		circle.setPropertyInput("longitude", deviceLocation.getProperty("longitude"));
		circle.setPropertyInput("radius", deviceLocation.getProperty("accuracy"));
		circle.getProperty("display").startUpdating(); //MEDEBUG
		
		this._mapView.addOverlay(circle);
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