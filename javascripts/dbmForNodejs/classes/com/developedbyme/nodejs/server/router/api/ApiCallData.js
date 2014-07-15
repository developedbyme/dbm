/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.api.ApiCallData", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData");
	//"use strict";
	
	//Self reference
	var ApiCallData = dbm.importClass("com.developedbyme.nodejs.server.router.api.ApiCallData");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::_init");
		
		this.superCall();
		
		this._status = ProcessStatusTypes.NOT_STARTED; //METODO
		this.routingData = null;
		this._timeoutLength = -1;
		
		return this;
	};
	
	objectFunctions.setTimeoutLength = function(aTimeoutLength) {
		this._timeoutLength = aTimeoutLength;
		
		return this;
	};
	
	objectFunctions.startTimeout = function() {
		//METODO
		
		return this;
	};
	
	objectFunctions._callTimedOut = function() {
		//METODO
	};
	
	objectFunctions.callDone = function() {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::callDone");
		this.routingData.setAsDone();
		this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, null);
	};
	
	objectFunctions.callError = function(aText, aError) {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::callError");
		this.routingData.setError(aText, aError);
		this.getExtendedEvent().perform(ProcessExtendedEventIds.ERROR, null);
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case ProcessExtendedEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "routingData":
				return false;
		}
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.routingData = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aRoutingData) {
		//console.log("com.developedbyme.nodejs.server.router.api.ApiCallData::create");
		
		var newApiCallData = ClassReference._createAndInitClass(ClassReference);
		
		newApiCallData.routingData = aRoutingData;
		
		return newApiCallData;
	};
});