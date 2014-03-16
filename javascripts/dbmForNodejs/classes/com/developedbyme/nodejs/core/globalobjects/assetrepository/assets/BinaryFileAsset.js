/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset");
	//"use strict";
	
	var fs = require("fs");
	
	var BinaryFileAsset = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var StaticCallbackLink = dbm.importClass("com.developedbyme.core.extendedevent.eventlink.StaticCallbackLink");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	staticFunctions._IO_CALLBACK = "ioCallback";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset::_init");
		
		this.superCall();
		
		this._url = null;
		this.useAsync = true; //METODO: use this setting
		this._readFormat = "binary";
		
		this._callbackEventLink = StaticCallbackLink.create(this.getExtendedEvent(), ClassReference._IO_CALLBACK);
		this.getExtendedEvent().addEventLink(this._callbackEventLink, ClassReference._IO_CALLBACK, true);
		
		this.getExtendedEvent().addCommandToEvent(ClassReference._IO_CALLBACK, CallFunctionCommand.createCommand(this, this._callback_ioDone, [GetVariableObject.createSelectMultipleArgumentDataCommand(0), GetVariableObject.createSelectMultipleArgumentDataCommand(1)]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset::load");
		
		fs.readFile(this._url, this._readFormat, this._callbackEventLink.getCallbackFunction());
		
		return this;
	};
	
	objectFunctions._callback_ioDone = function(aError, aFile) {
		console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset::_callback_ioDone");
		console.log(aError, aFile);
		
		if(aError) {
			this._setStatus(AssetStatusTypes.ERROR);
			this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR, aError);
		}
		else {
			this._data.setValue(aFile);
			this._setStatus(AssetStatusTypes.LOADED);
			this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED);
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ClassReference._IO_CALLBACK:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aUrl) {
		var newBinaryFileAsset = (new ClassReference()).init();
		newBinaryFileAsset.setUrl(aUrl);
		return newBinaryFileAsset;
	};
});