/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.server.router.api.ApiCallRouter", "dbm.nodejs.server.router.RouterBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.server.router.api.ApiCallRouter");
	//"use strict";
	
	var url = require("url");
	
	//Self reference
	var ApiCallRouter = dbm.importClass("dbm.nodejs.server.router.api.ApiCallRouter");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var ApiCallData = dbm.importClass("dbm.nodejs.server.router.api.ApiCallData");
	var EqualsQualifier = dbm.importClass("dbm.nodejs.server.router.qualifiers.EqualsQualifier");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("dbm.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Constants
	var RoutedDataTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataTypes");
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::_init");
		
		this.superCall();
		
		this._timeoutLength = -1;
		
		this._callDoneCommand = this.addDestroyableObject(CallFunctionCommand.createCommand(this, this._apiCallDone, [GetVariableObject.createSelectOwnerObjectCommand()]).retain());
		
		this._activeCalls = new Array();
		
		return this;
	};
	
	objectFunctions._performRoute = function(aRoutedData) {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::_performRoute");
		
		var apiCallData = ApiCallData.create(aRoutedData);
		this._activeCalls.push(apiCallData);
		this._performApiCall(apiCallData);
		
		return RoutedDataStatusTypes.UNKNOWN;
	};
	
	objectFunctions._performApiCall = function(aApiCallData) {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::_performApiCall");
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.NEW)) {
			aApiCallData.setTimeoutLength(this._timeoutLength).startTimeout();
			aApiCallData.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.DONE, this._callDoneCommand);
			aApiCallData.getExtendedEvent().addCommandToEvent(ProcessExtendedEventIds.ERROR, this._callDoneCommand);
			this.getExtendedEvent().perform(GenericExtendedEventIds.NEW, aApiCallData);
		}
		else {
			aApiCallData.setError("Method not implemented");
			this._apiCallDone(aApiCallData);
		}
	};
	
	objectFunctions._apiCallDone = function(aApiCallData) {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::_apiCallDone");
		
		var routedData = aApiCallData.routingData;
		
		ArrayFunctions.removeFromArray(this._activeCalls, aApiCallData);
		aApiCallData.destroy();
		
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, routedData);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case GenericExtendedEventIds.NEW:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._filePathReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aPath) {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::create");
		
		var newApiCallRouter = ClassReference._createAndInitClass(ClassReference);
		
		ClassReference.setStaticPathQualifierToRouter(newApiCallRouter, aPath);
		
		return newApiCallRouter;
	};
	
	staticFunctions.setStaticPathQualifierToRouter = function(aRouter, aPath) {
		//console.log("dbm.nodejs.server.router.api.ApiCallRouter::setStaticPathQualifierToRouter");
		
		var qualifier = EqualsQualifier.create(
			aPath,
			CallFunctionObject.createFunctionOnObjectCommand(
				SelectBaseObjectObject.createCommand(),
				"getLocalPath",
				[]
			)
		);
		aRouter.addQualifier(qualifier);
		
		return aRouter;
	};
});