/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset", "dbm.core.globalobjects.assetrepository.assets.XmlAsset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	
	var ArrayBufferAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("dbm.constants.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("dbm.constants.AssetStatusTypes");
	var ReadyStateTypes = dbm.importClass("dbm.constants.ReadyStateTypes");
	var XmlHttpResponseTypes = dbm.importClass("dbm.constants.XmlHttpResponseTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_setupData");
		this._data.setValue(this._loader.response);
	};
	
	objectFunctions._setupResponseType = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset::_setupResponseType");
		this._loader.responseType = XmlHttpResponseTypes.ARRAY_BUFFER;
	};
	
	staticFunctions.create = function(aUrl) {
		var newArrayBufferAsset = (new ClassReference()).init();
		newArrayBufferAsset.setUrl(aUrl);
		return newArrayBufferAsset;
	};
});