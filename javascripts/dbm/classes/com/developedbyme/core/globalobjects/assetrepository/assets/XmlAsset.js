/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	//"use strict";
	
	//Self reference
	var XmlAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var ReevaluationCreator = dbm.importClass("com.developedbyme.utils.reevaluation.ReevaluationCreator");
	var FormUrlEncodeReevaluationObject = dbm.importClass("com.developedbyme.utils.reevaluation.encodingreevaluation.FormUrlEncodeReevaluationObject");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var ReadyStateTypes = dbm.importClass("com.developedbyme.constants.ReadyStateTypes");
	var XmlHttpResponseTypes = dbm.importClass("com.developedbyme.constants.XmlHttpResponseTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::_init");
		
		this.superCall();
		
		this._loader = null;
		this._url = null;
		this._requestMethod = "GET";
		this._requestDataReevaluator = null;
		this._requestHeaders = null;
		this.useAsync = true;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.getUrl = function() {
		return this._url;
	};
	
	objectFunctions._internalFunctionality_setData = function(aData) {
		this._data.setValue(aData);
		this._setStatus(AssetStatusTypes.LOADED);
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
	
	objectFunctions._updateReadyState = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::_updateReadyState");
		//console.log("state:", this._loader.readyState);
		
		switch(this._loader.readyState) {
			case ReadyStateTypes.UNINITIALIZED:
			case ReadyStateTypes.SET_UP:
			case ReadyStateTypes.SENT:
			case ReadyStateTypes.PARTLY_DONE:
				//MENOTE: do nothing
				break;
			case ReadyStateTypes.DONE:
				//console.log("status:", this._loader.status);
				if(this._loader.status < 400) {
					this._setupData();
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED);
				}
				else {
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR);
				}
				break;
		}
	};
	
	objectFunctions._setupData = function() {
		this._data.setValue(this._loader.responseXML);
	};
	
	objectFunctions._setupResponseType = function() {
		this._loader.responseType = XmlHttpResponseTypes.DOCUMENT;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::load");
		
		if(this._status.getValue() !== AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		var currentUrl = this._url;
		var requestData = null;
		if(this._requestDataReevaluator !== null) {
			requestData = this._requestDataReevaluator.reevaluate(this);
			if(this._requestMethod === "GET") {
				currentUrl += "?" + requestData;
				requestData = null;
			}
		}
		
		this._setStatus(AssetStatusTypes.LOADING);
		this._loader = XmlCreator.createXmlLoader();
		this._loader.open(this._requestMethod, currentUrl, this.useAsync);
		this._setupResponseType();
		
		var thisPointer = this;
		//METODO: change this to addEventListener
		this._loader.onreadystatechange = function() {
			thisPointer._updateReadyState();
		};
		
		if(this._requestHeaders !== null) {
			var currentArray = this._requestHeaders.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentHeaderName = currentArray[i];
				var currentReevaluator = this._requestHeaders.getObject(currentHeaderName);
				console.log(">>>>>", currentHeaderName, currentReevaluator.reevaluate(this));
				this._loader.setRequestHeader(currentHeaderName, currentReevaluator.reevaluate(this));
			}
		}
		
		this._loader.send(requestData);
		
		return this;
	};
	
	staticFunctions.create = function(aUrl) {
		var newXmlAsset = (new ClassReference()).init();
		newXmlAsset.setUrl(aUrl);
		return newXmlAsset;
	};
});