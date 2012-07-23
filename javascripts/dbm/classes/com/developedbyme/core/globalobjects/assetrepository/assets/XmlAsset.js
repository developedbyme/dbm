dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.Asset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	//"use strict";
	
	var XmlAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlCreator = dbm.importClass("com.developedbyme.utils.xml.XmlCreator");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("com.developedbyme.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var ReadyStateTypes = dbm.importClass("com.developedbyme.constants.ReadyStateTypes");
	var XmlHttpResponseTypes = dbm.importClass("com.developedbyme.constants.XmlHttpResponseTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::_init");
		
		this.superCall();
		
		this._loader = null;
		this._url = null;
		this.useAsync = true;
		
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
	
	objectFunctions._updateReadyState = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::_updateReadyState");
		//console.log("state:", this._loader.readyState);
		
		switch(this._loader.readyState) {
			case ReadyStateTypes.UNINITIALIZED:
			case ReadyStateTypes.SET_UP:
			case ReadyStateTypes.SENT:
			case ReadyStateTypes.PARTLY_DONE:
				//MENOTE: do nothing
				break;
			case ReadyStateTypes.DONE:
				//console.log("status:", this._loader.status);
				if(this._loader.status < 400) {
					this._setupData();
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADED);
				}
				else {
					this.getExtendedEvent().perform(LoadingExtendedEventIds.LOADING_ERROR);
				}
				break;
		}
	};
	
	objectFunctions._setupData = function() {
		this._data.setValue(this._loader.responseXML);
	};
	
	objectFunctions._setupResponseType = function() {
		this._loader.responseType = XmlHttpResponseTypes.DOCUMENT;
	};
	
	objectFunctions.load = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset::load");
		
		if(this._status.getValue() != AssetStatusTypes.NOT_LOADED) {
			return this;
		}
		
		this._setStatus(AssetStatusTypes.LOADING);
		this._loader = XmlCreator.createXmlLoader();
		this._loader.open("GET", this._url, this.useAsync);
		this._setupResponseType();
		
		var thisPointer = this;
		this._loader.onreadystatechange = function() {
			thisPointer._updateReadyState();
		}
		//this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.LOAD, LoadingExtendedEventIds.LOADED, LoadingExtendedEventIds.LOADED, true).activate();
		//this.getExtendedEvent().linkJavascriptEvent(this._data, JavascriptEventIds.ERROR, LoadingExtendedEventIds.LOADING_ERROR, LoadingExtendedEventIds.LOADED, true);
		
		this._loader.send(null);
		
		return this;
	};
	
	staticFunctions.create = function(aUrl) {
		var newXmlAsset = (new ClassReference()).init();
		newXmlAsset.setUrl(aUrl);
		return newXmlAsset;
	};
});