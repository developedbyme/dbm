/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.response.StaticResponseRouter", "com.developedbyme.nodejs.server.router.RouterBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.response.StaticResponseRouter");
	//"use strict";
	
	var StaticResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.StaticResponseRouter");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.response.StaticResponseRouter::_init");
		
		this.superCall();
		
		this._responseCode = 500;
		this._responseHeaders = null;
		this._responseText = "";
		
		return this;
	};
	
	objectFunctions.setup = function(aCode, aHeaders, aText) {
		this._responseCode = aCode;
		this._responseHeaders = aHeaders;
		this._responseText = aText;
		
		return this;
	};
	
	objectFunctions._performRoute = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.response.StaticResponseRouter::_performRoute");
		
		var theResponse = aRoutedData.response;
		
		theResponse.writeHead(this._responseCode, this._responseHeaders);
		theResponse.end(this._responseText);
		
		aRoutedData.setAsDone();
		return aRoutedData.getStatus();
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aCode, aHeaders, aText) {
		//console.log("com.developedbyme.nodejs.server.router.response.StaticResponseRouter::create");
		
		var newStaticResponseRouter = (new ClassReference()).init();
		
		newStaticResponseRouter.setup(aCode, aHeaders, aText);
		
		return newStaticResponseRouter;
	};
});