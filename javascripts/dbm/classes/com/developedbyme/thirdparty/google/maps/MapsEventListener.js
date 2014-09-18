/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.thirdparty.google.maps.MapsEventListener", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var MapsEventListener = dbm.importClass("com.developedbyme.thirdparty.google.maps.MapsEventListener");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.thirdparty.google.maps.MapsEventListener::_init");
		
		this.superCall();
		
		this._object = null;
		
		return this;
	};
	
	objectFunctions.setObject = function(aObject) {
		this._object = aObject;
		
		return this;
	};
	
	objectFunctions.addEventListener = function(aEventName, aListener, aUseCapture) {
		console.log("com.developedbyme.thirdparty.google.maps.MapsEventListener::addEventListener");
		
		google.maps.event.addListener(this._object, aEventName, aListener);
	};
	
	objectFunctions.removeEventListener = function(aEventName, aListener, aUseCapture) {
		console.log("com.developedbyme.thirdparty.google.maps.MapsEventListener::removeEventListener");
		
		google.maps.event.removeListener(this._object, aEventName, aListener);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newMapsEventListener = (new ClassReference).init();
		
		return newMapsEventListener;
	};
});