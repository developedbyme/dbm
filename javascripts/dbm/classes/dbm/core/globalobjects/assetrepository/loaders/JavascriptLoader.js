/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader");
	
	//Self reference
	var JavascriptLoader = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader::_init");
		
		this.superCall();
		
		this._status = AssetStatusTypes.NOT_LOADED;
		this._scriptTag = null;
		this._url = null;
		this._javascriptVersion = null;
		this._asynchronous = false;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
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
	
	objectFunctions.load = function() {
		//console.log("dbm.core.globalobjects.assetrepository.loaders.JavascriptLoader::load");
		
		if(this._status !== AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._status = AssetStatusTypes.LOADING;
		
		this._scriptTag = dbm.getDocument().createElement("script");
		
		var scriptType = "application/javascript";
		if(this._javascriptVersion !== null) {
			scriptType += ";version=" + this._javascriptVersion;
		}
		this._scriptTag.type = scriptType;
		this._scriptTag.src = this._url;
		this._scriptTag.async = this._asynchronous;
		
		this.getExtendedEvent().linkJavascriptEvent(this._scriptTag, "load", LoadingExtendedEventIds.LOADED, "default", true, true);
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
	
	staticFunctions.create = function(aUrl) {
		var newJavascriptLoader = (new ClassReference()).init();
		newJavascriptLoader.setUrl(aUrl);
		return newJavascriptLoader;
	};
});