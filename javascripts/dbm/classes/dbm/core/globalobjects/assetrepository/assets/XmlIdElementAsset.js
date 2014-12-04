/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset", "dbm.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	//"use strict";
	
	var XmlIdElementAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset::_init");
		
		this.superCall();
		
		this._id = null;
		this._xmlAsset = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setup = function(aId, aXmlAsset) {
		//console.log("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset::setup");
		//console.log(aId, aXmlAsset);
		
		this._id = aId;
		this._xmlAsset = aXmlAsset;
		this._xmlAsset.retain();
		this.addDestroyableObject(this._xmlAsset);
		
		if(this._xmlAsset.getStatus() === AssetStatusTypes.LOADED) {
			this._xmlLoaded();
		}
		else if(this._xmlAsset.getStatus() === AssetStatusTypes.LOADED) {
			this._xmlLoadingError();
		}
		else {
			this._xmlAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._xmlLoaded, []));
			this._xmlAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._xmlLoadingError, []));
		}
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset::_setupData");
		//console.log(this._xmlAsset, this._xmlAsset.getData());
		var theDocument = this._xmlAsset.getData();
		var theElement = theDocument.getElementById(this._id);
		
		if(theElement === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "_setupData", "Document doesn't have a node with id " + this._id + ".");
		}
		
		this._data.setValue(theElement);
	};
	
	objectFunctions._xmlLoaded = function() {
		this._setupData();
		this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED);
	};
	
	objectFunctions._xmlLoadingError = function() {
		this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR);
	};
	
	objectFunctions.load = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset::load");
		
		this._xmlAsset.load();
		
		return this;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._xmlAsset = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aId, aXmlAsset) {
		var newXmlIdElementAsset = (new ClassReference()).init();
		newXmlIdElementAsset.setup(aId, aXmlAsset);
		return newXmlIdElementAsset;
	};
});