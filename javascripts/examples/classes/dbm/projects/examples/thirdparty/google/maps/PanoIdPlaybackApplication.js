/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication", "dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var PanoIdPlaybackApplication = dbm.importClass("dbm.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptLoader = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader");
	var StreetView = dbm.importClass("dbm.thirdparty.google.maps.StreetView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("dbm.thirdparty.google.maps.ApiFunctions");
	var AngleFunctions = dbm.importClass("dbm.utils.math.AngleFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var StreetViewEventIds = dbm.importClass("dbm.constants.thirdparty.google.maps.StreetViewEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication::_createPage");
		
		this.superCall();
		this._mapView.setLocation(51.51534,-0.204665);
		
		var currentArray = ["Ln896BXtEMg5vfIyWPkYnw", "iWgRmNF971Ozcdf15-Eifg", "gAFmTd6fGjwzSq3GgdtFaw", "TWi5rxVt4h2DUwLDBt8GFg", "y9RdbCQrU-GJH8uyZiMZdg", "eQ_DODG07CXlf-GPBP7maw", "wJfv7PHIxjyP3vw90nw_3A", "V9M1_789aP4q_wrn6R0PrA", "Ui8yEkSMN9p05OqD4566nQ", "y6aiAMI7b0ifRYHgvWs-kQ", "RdENffwYsXS4SQ_IWBTDoA"];
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._mapView.getProperty("panoId").setValueWithDelay(currentArray[i], i*3);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});