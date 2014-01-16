dbm.registerClass("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter");
	//"use strict";
	
	var ErrorResponseRouter = dbm.importClass("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter::_init");
		
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
	
	objectFunctions.route = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter::route");
		
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
		//console.log("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter::create");
		
		var newErrorResponseRouter = (new ClassReference()).init();
		
		newErrorResponseRouter.setup(aCode, aHeaders, aText);
		
		return newErrorResponseRouter;
	};
	
	staticFunctions.createStandardResponse = function() {
		//console.log("com.developedbyme.nodejs.server.router.response.ErrorResponseRouter::createStandardResponse");
		
		var newErrorResponseRouter = (new ClassReference()).init();
		
		newErrorResponseRouter.setup(500, {"Content-Type": "text/html"}, "500 Internal server error");
		
		return newErrorResponseRouter;
	};
});