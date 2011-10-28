dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	
	var XmlAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var ReadyStateTypes = dbm.importClass("com.developedbyme.constants.ReadyStateTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::init");
		
		this.superCall();
		
		this._loader = null;
		this._url = null;
		
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.LOADED]));
		this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADING_ERROR, CallFunctionCommand.createCommand(this, this._setStatus, [AssetStatusTypes.ERROR]));
		
		return this;
	};
	
	objectFunctions.setUrl = function(aUrl) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::setUrl");
		//console.log(aUrl);
		
		this._url = aUrl;
		
		return this;
	};
	
	objectFunctions.updateReadyState = function() {
		console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::updateReadyState");
		console.log(this._loader.readyState, this._loader.status);
		
		switch(this._loader.readyState) {
			case ReadyStateTypes.UNINITIALIZED:
			case ReadyStateTypes.SET_UP:
			case ReadyStateTypes.SENT:
			case ReadyStateTypes.PARTLY_DONE:
				//MENOTE: do nothing
				break;
			case ReadyStateTypes.DONE:
				if(this._loader.status < 400) {
					this.data = this._loader.responseXML;
					this.perform(LoadingExtendedEventIds.LOADED);
				}
				else {
					this.perform(LoadingExtendedEventIds.LOADING_ERROR);
				}
				break;
		}
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::load");
		
		this._setStatus(AssetStatusTypes.LOADING);
		this._loader = XmlCreator.createXmlLoader();
		
		var thisPointer = this;
		this._loader.onreadystatechange = function() {
			thisPointer._updateReadyState();
		}
		this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		this._loader.open("GET", this._url, false);
		this._loader.send(null);
		
		return this;
	};
	
	staticFunctions.create = function(aUrl) {
		var newXmlAsset = (new ClassReference()).init();
		newXmlAsset.setUrl(aUrl);
		return newXmlAsset;
	};
});