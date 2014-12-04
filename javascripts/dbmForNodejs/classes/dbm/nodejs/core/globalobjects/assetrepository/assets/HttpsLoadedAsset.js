/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset", "dbm.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset");
	//"use strict";
	
	var https = require("https");
	var url = require("url");
	
	var HttpsLoadedAsset = dbm.importClass("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("dbm.core.extendedevent.eventlink.StaticCallbackLink");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var ReevaluationCreator = dbm.importClass("dbm.utils.reevaluation.ReevaluationCreator");
	var FormUrlEncodeReevaluationObject = dbm.importClass("dbm.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	var RequestEventIds = dbm.importClass("dbm.nodejs.constants.nodejsevents.RequestEventIds");
	var ResponseEventIds = dbm.importClass("dbm.nodejs.constants.nodejsevents.ResponseEventIds");
	
	staticFunctions._REQUEST = "request";
	staticFunctions._RESPONSE = "response";
	
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::_init");
		
		this.superCall();
		
		this._request = null;
		this._response = null;
		this._data = null;
		this._url = null;
		this._requestMethod = "GET";
		this._requestDataReevaluator = null;
		this._requestHeaders = null;
		
		this._encodingOptions = NamedArray.create(true);
		this.addDestroyableObject(this._encodingOptions);
		
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
	
	objectFunctions.addEncodingOption = function(aName, aValue) {
		
		this._encodingOptions.addObject(aName, ReevaluationCreator.reevaluationOrStaticValue(aValue));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::setUrl");
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
		console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::load");
		
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
		
		var parsedUrl = url.parse(currentUrl);
		var optionsObject = new Object();
		optionsObject["hostname"] = parsedUrl["hostname"];
		optionsObject["port"] = VariableAliases.valueWithDefault(parsedUrl["port"], 443);
		optionsObject["path"] = parsedUrl["path"];
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
		
		var currentArray = this._encodingOptions.getNamesArray();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentHeaderName = currentArray[i];
			var currentReevaluator = this._encodingOptions.getObject(currentHeaderName);
			optionsObject[currentHeaderName] = currentReevaluator.reevaluate(this);
		}
		
		console.log(optionsObject);
		
		this._request = https.request(optionsObject);
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
		//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::_firstResponse");
		//console.log(aResponse);
		
		this._data = "";
		this._response = aResponse;
		
		this.getExtendedEvent().linkJavascriptEvent(this._response, ResponseEventIds.DATA, ResponseEventIds.DATA, ClassReference._RESPONSE, true, false);
		this.getExtendedEvent().linkJavascriptEvent(this._response, ResponseEventIds.END, ResponseEventIds.END, ClassReference._RESPONSE, true, false);
		
		this.getExtendedEvent().activateJavascriptEventLink(ClassReference._RESPONSE);
		
		
	};
	
	objectFunctions._addResponseData = function(aData) {
		//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::_addResponseData");
		//console.log(aData);
		
		this._data += aData;
	};
	
	objectFunctions._responseDone = function() {
		//console.log("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset::_responseDone");
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
		var newHttpsLoadedAsset = (new ClassReference()).init();
		newHttpsLoadedAsset.setUrl(aUrl);
		return newHttpsLoadedAsset;
	};
});