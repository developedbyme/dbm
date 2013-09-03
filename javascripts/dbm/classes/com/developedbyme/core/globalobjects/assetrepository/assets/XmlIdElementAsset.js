dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	//"use strict";
	
	var XmlIdElementAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset::_init");
		
		this.superCall();
		
		this._id = null;
		this._xmlAsset = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setup = function(aId, aXmlAsset) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset::setup");
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset::_setupData");
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset::load");
		
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