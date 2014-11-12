/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	
	//Self reference
	var JavascriptWithCallbackLoader = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	//Constants
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader::_init");
		
		this.superCall();
		
		this._status = AssetStatusTypes.NOT_LOADED;
		this._scriptTag = null;
		this._url = null;
		this._javascriptVersion = null;
		this._asynchronous = false;
		
		this._callbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), LoadingExtendedEventIds.LOADED);
		this.getExtendedEvent().addEventLink(this._callbackEventLink, LoadingExtendedEventIds.LOADED, true);
		
		this._callbackFunctionId = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._removeCallbackFunction, []));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._removeCallbackFunction, []));
		
		return this;
	};
	
	objectFunctions.setCallbackFunctionId = function(aId) {
		this._callbackFunctionId = aId;
		
		return this;
	};
	
	objectFunctions.getStatus = function() {
		return this._status;
	};
	
	objectFunctions._setStatus = function(aStatus) {
		this._status = aStatus;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		this._url = aUrl;
		
		return this._url;
	};
	
	objectFunctions._createCallbackFunction = function() {
		dbm.singletons[this._callbackFunctionId] = this._callbackEventLink.getCallbackFunction();
	};
	
	objectFunctions._removeCallbackFunction = function() {
		delete dbm.singletons[this._callbackFunctionId];
	}
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.loaders.JavascriptWithCallbackLoader::load");
		//console.log(this);
		
		if(this._status !== AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._status = AssetStatusTypes.LOADING;
		
		this._createCallbackFunction();
		
		this._scriptTag = dbm.getDocument().createElement("script");
		
		var scriptType = "application/javascript";
		if(this._javascriptVersion !== null) {
			scriptType += ";version=" + this._javascriptVersion;
		}
		this._scriptTag.type = scriptType;
		this._scriptTag.src = this._url;
		this._scriptTag.async = this._asynchronous;
		
		this.getExtendedEvent().linkJavascriptEvent(this._scriptTag, "error", LoadingExtendedEventIds.LOADING_ERROR, "default", true, true);
		this.getExtendedEvent().activateJavascriptEventLink("default");
		
		var headTags = dbm.getDocument().getElementsByTagName("head");
		headTags[0].appendChild(this._scriptTag);
		
		return this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.LOADED:
			case LoadingExtendedEventIds.LOADING_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function(aUrl, aCallbackFunctionId) {
		var newJavascriptWithCallbackLoader = (new ClassReference()).init();
		newJavascriptWithCallbackLoader.setUrl(aUrl);
		newJavascriptWithCallbackLoader.setCallbackFunctionId(aCallbackFunctionId);
		return newJavascriptWithCallbackLoader;
	};
});