/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.server.router.response.ErrorResponseRouter", "dbm.nodejs.server.router.RouterBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.response.ErrorResponseRouter");
	//"use strict";
	
	var ErrorResponseRouter = dbm.importClass("dbm.nodejs.server.router.response.ErrorResponseRouter");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var RoutedDataTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.response.ErrorResponseRouter::_init");
		
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
		console.log("dbm.nodejs.server.router.response.ErrorResponseRouter::_performRoute");
		
		var theResponse = aRoutedData.response;
		
		theResponse.writeHead(this._responseCode, this._responseHeaders);
		
		theResponse.end(this.getResponseText(aRoutedData));
		
		aRoutedData.setAsDone();
		return aRoutedData.getStatus();
	};
	
	objectFunctions.getResponseText = function(aRoutedData) {
		var returnText = "";
		returnText += "<html><head><title>" + this._responseText + "</title><body><h1>" + this._responseText + "</h1><p>" + aRoutedData.getErrorText() + "</p>";
		
		var theError = aRoutedData.getError();
		if(theError !== null) {
			returnText += "<div class=\"stackTrace\"><pre>" + theError.stack + "</pre></div>"
		}
		
		returnText += "</body></html>";
		
		return returnText;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aCode, aHeaders, aText) {
		//console.log("dbm.nodejs.server.router.response.ErrorResponseRouter::create");
		
		var newErrorResponseRouter = (new ClassReference()).init();
		
		newErrorResponseRouter.setup(aCode, aHeaders, aText);
		
		return newErrorResponseRouter;
	};
	
	staticFunctions.createStandardResponse = function() {
		//console.log("dbm.nodejs.server.router.response.ErrorResponseRouter::createStandardResponse");
		
		var newErrorResponseRouter = (new ClassReference()).init();
		
		newErrorResponseRouter.setup(500, {"Content-Type": "text/html"}, "500 Internal server error");
		
		return newErrorResponseRouter;
	};
});