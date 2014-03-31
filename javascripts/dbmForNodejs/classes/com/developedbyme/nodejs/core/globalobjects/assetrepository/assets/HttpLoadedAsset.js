/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset");
	//"use strict";
	
	var http = require("http");
	var url = require("url");
	
	var HttpLoadedAsset = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var FormUrlEncodeReevaluationObject = dbm.importClass("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var RequestEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.RequestEventIds");
	var ResponseEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.ResponseEventIds");
	
	staticFunctions._REQUEST = "request";
	staticFunctions._RESPONSE = "response";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::_init");
		
		this.superCall();
		
		this._request = null;
		this._response = null;
		this._data = null;
		this._url = null;
		this._requestMethod = "GET";
		this._requestDataReevaluator = null;
		this._requestHeaders = null;
		
		this.getExtendedEvent().addCommandToEvent(RequestEventIds.RESPONSE, CallFunctionCommand.createCommand(this, this._firstResponse, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		this.getExtendedEvent().addCommandToEvent(ResponseEventIds.DATA, CallFunctionCommand.createCommand(this, this._addResponseData, [GetVariableObject.createSelectMultipleArgumentDataCommand(0)]));
		this.getExtendedEvent().addCommandToEvent(ResponseEventIds.END, CallFunctionCommand.createCommand(this, this._responseDone, []));
		
		return this;
	};
	
	objectFunctions.setRequestMethod = function(aMethod) {
		this._requestMethod = aMethod;
		
		return this;
	};
	
	objectFunctions.getRequestMethod = function() {
		return this._requestMethod;
	};
	
	objectFunctions.addHeader = function(aName, aValue) {
		if(this._requestHeaders === null) {
			this._requestHeaders = NamedArray.create(true);
			this.addDestroyableObject(this._requestHeaders);
		}
		
		this._requestHeaders.addObject(aName, ReevaluationCreator.reevaluationOrStaticValue(aValue));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.getUrl = function() {
		return this._url;
	};
	
	objectFunctions.setupAsFormObjectPost = function(aData) {
		this._requestMethod = "POST";
		this.addHeader("Content-Type", "application/x-www-form-urlencoded");
		
		this.setupFormObject(aData);
		
		return this;
	};
	
	objectFunctions.setupFormObject = function(aData) {
		
		this._requestDataReevaluator = FormUrlEncodeReevaluationObject.createCommand(aData);
		
		return this;
	};
	
	objectFunctions.load = function() {
		console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::load");
		
		//METODO
		var currentUrl = this._url;
		var requestData = null;
		if(this._requestDataReevaluator !== null) {
			requestData = this._requestDataReevaluator.reevaluate(this);
			if(this._requestMethod === "GET") {
				currentUrl += "?" + requestData;
				requestData = null;
			}
		}
		
		var optionsObject = url.parse(currentUrl);
		optionsObject["method"] = this._requestMethod;
		
		if(this._requestHeaders !== null) {
			var headersObject = new Object();
			var currentArray = this._requestHeaders.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentHeaderName = currentArray[i];
				var currentReevaluator = this._requestHeaders.getObject(currentHeaderName);
				headersObject[currentHeaderName] = currentReevaluator.reevaluate(this);
			}
			optionsObject["headers"] = headersObject;
		}
		
		console.log(optionsObject);
		
		this._request = http.request(optionsObject);
		this.getExtendedEvent().linkJavascriptEvent(this._request, RequestEventIds.RESPONSE, RequestEventIds.RESPONSE, ClassReference._REQUEST, true, false);
		//METODO: check for errors
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._REQUEST);
		
		if(requestData !== null) {
			this._request.write(requestData);
		}
		this._request.end();
		
		return this;
	};
	
	objectFunctions._firstResponse = function(aResponse) {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::_firstResponse");
		//console.log(aResponse);
		
		this._data = "";
		this._response = aResponse;
		
		this.getExtendedEvent().linkJavascriptEvent(this._response, ResponseEventIds.DATA, ResponseEventIds.DATA, ClassReference._RESPONSE, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._response, ResponseEventIds.END, ResponseEventIds.END, ClassReference._RESPONSE, true, false);
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._RESPONSE);
		
		
	};
	
	objectFunctions._addResponseData = function(aData) {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::_addResponseData");
		//console.log(aData);
		
		this._data += aData;
	};
	
	objectFunctions._responseDone = function() {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.HttpLoadedAsset::_responseDone");
		//console.log(this._data);
		
		if(this.getExtendedEvent().hasEvent(LoadingExtendedEventIds.LOADED)) {
			this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED, this._data);
		}
		
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case RequestEventIds.RESPONSE:
			case ResponseEventIds.DATA:
			case ResponseEventIds.END:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aUrl) {
		var newHttpLoadedAsset = (new ClassReference()).init();
		newHttpLoadedAsset.setUrl(aUrl);
		return newHttpLoadedAsset;
	};
});