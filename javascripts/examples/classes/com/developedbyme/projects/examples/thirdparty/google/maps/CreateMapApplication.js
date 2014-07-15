/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example that creates a google map.
 */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var CreateMapApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptWithCallbackLoader = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	var MapView = dbm.importClass("com.developedbyme.thirdparty.google.maps.MapView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("com.developedbyme.thirdparty.google.maps.ApiFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication::_init");
		
		this.superCall();
		
		this._mapView = null;
		
		var callbackName = dbm.singletons.dbmIdManager.getNewId("callback");
		
		var mapsApiLoader = JavascriptWithCallbackLoader.create(ApiFunctions.getJavascriptUrlWithCallback("AIzaSyCtZDKih6gjAI34VF4qXr28Nn-Z7uA7cPs", callbackName), callbackName);
		this._assetsLoader.addLoader(mapsApiLoader);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createMap = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication::_createMap");
		
		this._mapView = MapView.createDiv(dbm.getDocument(), true, {"style": "width: 400px; height: 400px"});
		this._mapView.createDisplay();
		this._mapView.setLocation(51.5286416, -0.1015987);
		this._mapView.getProperty("display").startUpdating();
		
		console.log(this._mapView);
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication::_createPage");
		
		this._createMap();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});