dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset");
	
	var VideoAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset::init");
		
		this.superCall();
		
		this._url = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset::load");
		
		this._setStatus(AssetStatusTypes.LOADING);
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.singletons.dbmPageManager.getDocument());
		
		this._data = htmlCreator.createNode("video", {"preload": "none"});
		this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		this._data.src = this._url;
		this._data.load();
		
		return this;
	};
	
	staticFunctions.create = function(aUrl) {
		var newVideoAsset = (new ClassReference()).init();
		newVideoAsset.setUrl(aUrl);
		return newVideoAsset;
	};
});