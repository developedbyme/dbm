/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An asset that is loaded from the users local system.
 */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset", "dbm.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset");
	//"use strict";
	
	//Self reference
	var FileReaderAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("dbm.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset::_init");
		
		this.superCall();
		
		this._loader = null;
		this._file = null;
		this._readMode = "binary";
		this._encodingOption = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setupData, []));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setReadMode = function(aMode) {
		this._readMode = aMode;
		
		return this;
	};
	
	objectFunctions.getReadMode = function() {
		return this._readMode;
	};
	
	objectFunctions.setFile = function(aFile) {
		//console.log("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset::setFile");
		//console.log(aUrl);
		
		this._file = aFile;
		this._loadingSize = this._file.size;
		
		return this;
	};
	
	objectFunctions.getFile = function() {
		return this._file;
	};
	
	objectFunctions._internalFunctionality_setData = function(aData) {
		this._data.setValue(aData);
		this._setStatus(AssetStatusTypes.LOADED);
	};
	
	objectFunctions._setupData = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset::_setupData");
		//console.log(this._loader.result);
		
		this._data.setValue(this._loader.result);
	};
	
	objectFunctions.load = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset::load");
		
		if(this._status.getValue() !== AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._setStatus(AssetStatusTypes.LOADING);
		
		this._loader = new FileReader();
		this.getExtendedEvent().linkJavascriptEvent(this._loader, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._loader, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		
		switch(this._readMode) {
			default:
				//METODO: error message
			case "binary":
				this._loader.readAsBinaryString(this._file);
				break;
			case "text":
				this._loader.readAsText(this._file, this._encodingOption);
				break;
			case "arrayBuffer":
				this._loader.readAsArrayBuffer(this._file);
				break;
			case "url":
				this._loader.readAsDataURL(this._file);
				break;
		}
		
		return this;
	};
	
	staticFunctions.create = function(aFile, aReadMode) {
		
		aReadMode = VariableAliases.valueWithDefault(aReadMode, "binary");
		
		var newFileReaderAsset = (new ClassReference()).init();
		newFileReaderAsset.setFile(aFile);
		newFileReaderAsset.setReadMode(aReadMode);
		return newFileReaderAsset;
	};
});