/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.google.maps.AnimateLocationApplication", "com.developedbyme.projects.examples.thirdparty.google.maps.CreateMapApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var AnimateLocationApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.google.maps.AnimateLocationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.google.maps.AnimateLocationApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.google.maps.AnimateLocationApplication::_createPage");
		
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