dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset");
	
	var VideoAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var VideoEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.VideoEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset::_init");
		
		this.superCall();
		
		this._url = null;
		this._loadingSize = 1000000;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.singletons.dbmPageManager.getDocument());
		
		var data = htmlCreator.createNode("video", {"preload": "none"});
		this._data.setValue(data);
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, SetPropertyAsDirtyCommand.createCommand(this._data));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		this.getExtendedEvent().createEvent(VideoEventIds.PROGRESS);
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.PROGRESS, CallFunctionCommand.createCommand(this, this._loadProgressCallback, [GetVariableObject.createSelectDataCommand()]));
		
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
		
		if(this._status.getValue() != AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._setStatus(AssetStatusTypes.LOADING);
		
		var data = this._data.getValue();
		
		//MENOTE: load event doesn't seem to be triggered so can play through is good enough
		//this.getExtendedEvent().linkJavascriptEvent(data, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(data, VideoEventIds.CAN_PLAY_THROUGH, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(data, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		//MENOTE: progress event doesn't seem to be triggered
		this.getExtendedEvent().linkJavascriptEvent(data, VideoEventIds.PROGRESS, VideoEventIds.PROGRESS, VideoEventIds.PROGRESS, true).activate();
		
		data.src = this._url;
		data.load();
		//MENOTE: download doesn't give any feedback of being downloaded if play is not called
		data.play();
		data.pause();
		
		return this;
	};
	
	objectFunctions._loadProgressCallback = function(aEvent) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset::_loadProgress");
		//console.log(aEvent);
		
		var maxBuffered = 0;
		var bufferRanges = this._data.getValue().buffered;
		var rangesLength = bufferRanges.length;
		for(var i = 0; i < rangesLength; i++) {
			maxBuffered = Math.max(maxBuffered, bufferRanges.end(i));
		}
		
		this._loadProgress = maxBuffered/this._data.getValue().duration;
		
	}
	
	staticFunctions.create = function(aUrl) {
		var newVideoAsset = (new ClassReference()).init();
		newVideoAsset.setUrl(aUrl);
		return newVideoAsset;
	};
});