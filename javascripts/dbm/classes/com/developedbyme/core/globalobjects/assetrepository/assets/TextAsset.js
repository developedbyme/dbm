dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset");
	
	var TextAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset");
	
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		this._data.setValue(this._loader.responseText);
	};
	
	objectFunctions._setupResponseType = function() {
		this._loader.responseType = XmlHttpResponseTypes.TEXT;
	};
	
	staticFunctions.create = function(aUrl) {
		var newTextAsset = (new ClassReference()).init();
		newTextAsset.setUrl(aUrl);
		return newTextAsset;
	};
});