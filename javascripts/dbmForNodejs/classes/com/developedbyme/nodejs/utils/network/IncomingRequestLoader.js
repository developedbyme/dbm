dbm.registerClass("com.developedbyme.nodejs.utils.network.IncomingRequestLoader", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.utils.network.IncomingRequestLoader");
	//"use strict";
	
	var IncomingRequestLoader = dbm.importClass("com.developedbyme.nodejs.utils.network.IncomingRequestLoader");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var ReadableStreamEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.ReadableStreamEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.utils.network.IncomingRequestLoader::_init");
		
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
		
		this._request = aRequest;
		
		this.getExtendedEvent().linkJavascriptEvent(this._request, ReadableStreamEventIds.DATA, ReadableStreamEventIds.DATA, ReadableStreamEventIds.DATA, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._request, ReadableStreamEventIds.END, ReadableStreamEventIds.END, ReadableStreamEventIds.DATA, true, false);
	};
	
	objectFunctions._dataReceived = function(aChunk) {
		console.log("com.developedbyme.nodejs.utils.network.IncomingRequestLoader::_dataReceived");
		
		this._data += aChunk;
	};
	
	objectFunctions._dataEnded = function() {
		console.log("com.developedbyme.nodejs.utils.network.IncomingRequestLoader::_dataEnded");
		
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
		//console.log("com.developedbyme.nodejs.utils.network.IncomingRequestLoader::create");
		//console.log(aElement);
		
		var newIncomingRequestLoader = (new ClassReference()).init();
		
		newIncomingRequestLoader.setRequest(aRequest);
		
		return newIncomingRequestLoader;
	};
});