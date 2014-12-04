/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var CreateStreetViewApplication = dbm.importClass("dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptWithCallbackLoader = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	var StreetView = dbm.importClass("dbm.thirdparty.google.maps.StreetView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("dbm.thirdparty.google.maps.ApiFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication::_init");
		
		this.superCall();
		
		this._mapView = null;
		
		var callbackName = dbm.singletons.dbmIdManager.getNewId("callback");
		
		var mapsApiLoader = JavascriptWithCallbackLoader.create(ApiFunctions.getJavascriptUrlWithCallback("AIzaSyCtZDKih6gjAI34VF4qXr28Nn-Z7uA7cPs", callbackName), callbackName);
		this._assetsLoader.addLoader(mapsApiLoader);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createMap = function() {
		console.log("dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication::_createMap");
		
		this._mapView = StreetView.createDiv(dbm.getDocument(), true, {"style": "width: 800px; height: 600px"});
		this._mapView.createDisplay();
		
		this._mapView.getProperty("display").startUpdating();
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication::_createPage");
		
		this._createMap();
		this._mapView.setLocation(39.097755, -123.704893);
		this._mapView.getProperty("heading").setValue(0.5*Math.PI);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});