/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter");
	//"use strict";
	
	var url = require("url");
	
	var StaticPathCallRouter = dbm.importClass("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ApiCallData = dbm.importClass("com.developedbyme.nodejs.server.router.api.ApiCallData");
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter::_init");
		
		this.superCall();
		
		this._path = null;
		this._timeoutLength = -1;
		
		return this;
	};
	
	objectFunctions.setup = function(aPath) {
		this._path = aPath;
		
		return this;
	};
	
	objectFunctions.route = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter::route");
		
		var theRequest = aRoutedData.request;
		
		var currentPath = url.parse(theRequest.url).pathname;
		
		console.log(currentPath, this._path);
		
		if(currentPath.indexOf(this._path) !== 0) {
			return RoutedDataStatusTypes.UNHANDLED;
		}
		
		var apiCallData = ApiCallData.create(aRoutedData);
		this._performApiCall(apiCallData);
		
		return RoutedDataStatusTypes.UNKNOWN;
	};
	
	objectFunctions._performApiCall = function(aApiCallData) {
		console.log("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter::_performApiCall");
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.NEW)) {
			aApiCallData.setTimeoutLength(this._timeoutLength).startTimeout();
			this.getExtendedEvent().perform(GenericExtendedEventIds.NEW, aApiCallData);
		}
		else {
			//METODO: error
		}
	}
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case GenericExtendedEventIds.NEW:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aPath) {
		//console.log("com.developedbyme.nodejs.server.router.api.StaticPathCallRouter::create");
		
		var newStaticPathCallRouter = (new ClassReference()).init();
		
		newStaticPathCallRouter.setup(aPath);
		
		return newStaticPathCallRouter;
	};
});