/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset", "com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	
	var ArrayBufferAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_setupData");
		this._data.setValue(this._loader.response);
	};
	
	objectFunctions._setupResponseType = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_setupResponseType");
		this._loader.responseType = XmlHttpResponseTypes.ARRAY_BUFFER;
	};
	
	staticFunctions.create = function(aUrl) {
		var newArrayBufferAsset = (new ClassReference()).init();
		newArrayBufferAsset.setUrl(aUrl);
		return newArrayBufferAsset;
	};
});