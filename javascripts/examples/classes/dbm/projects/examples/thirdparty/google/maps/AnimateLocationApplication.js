/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.thirdparty.google.maps.AnimateLocationApplication", "dbm.projects.examples.thirdparty.google.maps.CreateMapApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var AnimateLocationApplication = dbm.importClass("dbm.projects.examples.thirdparty.google.maps.AnimateLocationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.thirdparty.google.maps.AnimateLocationApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.thirdparty.google.maps.AnimateLocationApplication::_createPage");
		
		this.superCall();
		
		var animationTime = 5;
		var delayTime = 1;
		
		this._mapView.getProperty("latitude").animateValue(59.3261419, animationTime, InterpolationTypes.INVERTED_QUADRATIC, delayTime);
		this._mapView.getProperty("longitude").animateValue(17.9875456, animationTime, InterpolationTypes.INVERTED_QUADRATIC, delayTime);
		
		this._mapView.getProperty("zoom").animateValue(6, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, delayTime);
		this._mapView.getProperty("zoom").animateValue(8, 0.5*animationTime, InterpolationTypes.QUADRATIC, delayTime+0.5*animationTime);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});