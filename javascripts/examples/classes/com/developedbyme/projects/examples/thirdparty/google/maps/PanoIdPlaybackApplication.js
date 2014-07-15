/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication", "com.developedbyme.projects.examples.thirdparty.google.maps.CreateStreetViewApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var PanoIdPlaybackApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var JavascriptLoader = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptLoader");
	var StreetView = dbm.importClass("com.developedbyme.thirdparty.google.maps.StreetView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("com.developedbyme.thirdparty.google.maps.ApiFunctions");
	var AngleFunctions = dbm.importClass("com.developedbyme.utils.math.AngleFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	var StreetViewEventIds = dbm.importClass("com.developedbyme.constants.thirdparty.google.maps.StreetViewEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.PanoIdPlaybackApplication::_createPage");
		
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