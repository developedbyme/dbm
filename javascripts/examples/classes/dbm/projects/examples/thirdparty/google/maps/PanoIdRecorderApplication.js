/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.thirdparty.google.maps.PanoIdRecorderApplication", "dbm.projects.examples.thirdparty.google.maps.CreateStreetViewApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var PanoIdRecorderApplication = dbm.importClass("dbm.projects.examples.thirdparty.google.maps.PanoIdRecorderApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
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
		//console.log("dbm.projects.examples.thirdparty.google.maps.PanoIdRecorderApplication::_init");
		
		this.superCall();
		
		this._panoIds = new Array();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.thirdparty.google.maps.PanoIdRecorderApplication::_createPage");
		
		this.superCall();
		this._mapView.setLocation(51.51534,-0.204665);
		
		this._mapView.getExtendedEvent().addCommandToEvent(StreetViewEventIds.PANO_CHANGED, CallFunctionCommand.createCommand(this, this._callback_panoChanged, []));
	};
	
	objectFunctions._callback_panoChanged = function() {
		//console.log("dbm.projects.examples.thirdparty.google.maps.PanoIdRecorderApplication::_callback_panoChanged");
		
		var streetView = this._mapView.getProperty("streetView").getValue();
		this._panoIds.push(streetView.getPano());
		
		console.log(this._panoIds.toString());
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});