/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.utils.network.IncomingRequestLoader", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.utils.network.IncomingRequestLoader");
	//"use strict";
	
	var IncomingRequestLoader = dbm.importClass("dbm.nodejs.utils.network.IncomingRequestLoader");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var ReadableStreamEventIds = dbm.importClass("dbm.nodejs.constants.nodejsevents.ReadableStreamEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.utils.network.IncomingRequestLoader::_init");
		
		this.superCall();
		
		this._data = "";
		this._request = null;
		
		this.getExtendedEvent().addCommandToEvent(ReadableStreamEventIds.DATA, CallFunctionCommand.createCommand(this, this._dataReceived, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		this.getExtendedEvent().addCommandToEvent(ReadableStreamEventIds.END, CallFunctionCommand.createCommand(this, this._dataEnded, []));
		
		return this;
	};
	
	objectFunctions.getData = function() {
		return this._data;
	};
	
	objectFunctions.setRequest = function(aRequest) {
		//console.log("dbm.nodejs.utils.network.IncomingRequestLoader::setRequest");
		
		this._request = aRequest;
		
		this.getExtendedEvent().linkJavascriptEvent(this._request, ReadableStreamEventIds.DATA, ReadableStreamEventIds.DATA, ReadableStreamEventIds.DATA, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._request, ReadableStreamEventIds.END, ReadableStreamEventIds.END, ReadableStreamEventIds.DATA, true, false);
		
		this.getExtendedEvent().activateJavascriptEventLink(ReadableStreamEventIds.DATA);
	};
	
	objectFunctions._dataReceived = function(aChunk) {
		//console.log("dbm.nodejs.utils.network.IncomingRequestLoader::_dataReceived");
		
		this._data += aChunk;
	};
	
	objectFunctions._dataEnded = function() {
		//console.log("dbm.nodejs.utils.network.IncomingRequestLoader::_dataEnded");
		
		if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADED)) {
			this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED, this._data);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ReadableStreamEventIds.DATA:
			case ReadableStreamEventIds.END:
			case LoadingExtendedEventIds.LOADED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._request = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aRequest) {
		//console.log("dbm.nodejs.utils.network.IncomingRequestLoader::create");
		//console.log(aElement);
		
		var newIncomingRequestLoader = (new ClassReference()).init();
		
		newIncomingRequestLoader.setRequest(aRequest);
		
		return newIncomingRequestLoader;
	};
});