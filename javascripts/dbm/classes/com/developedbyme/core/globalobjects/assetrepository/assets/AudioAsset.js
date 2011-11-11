dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset");
	
	var AudioAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset::init");
		
		this.superCall();
		
		this._url = null;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.singletons.dbmPageManager.getDocument());
		
		var data = htmlCreator.createNode("audio", {"preload": "none"});
		this._data.setValue(data);
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, SetPropertyAsDirtyCommand.createCommand(this._data));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset::load");
		
		if(this._status.getValue() != AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._setStatus(AssetStatusTypes.LOADING);
		
		var data = this._data.getValue();
		
		this.getExtendedEvent().linkJavascriptEvent(data, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(data, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		
		
		data.src = this._url;
		data.load();
		
		return this;
	};
	
	staticFunctions.create = function(aUrl) {
		var newAudioAsset = (new ClassReference()).init();
		newAudioAsset.setUrl(aUrl);
		return newAudioAsset;
	};
});