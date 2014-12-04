/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset", "dbm.core.globalobjects.assetrepository.assets.XmlAsset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
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
		//console.log("dbm.core.globalobjects.assetrepository.assets.JsonAsset::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		this._data.setValue(JSON.parse(this._loader.responseText));
	};
	
	objectFunctions._setupResponseType = function() {
		this._loader.responseType = XmlHttpResponseTypes.TEXT;
	};
	
	staticFunctions.create = function(aUrl) {
		var newJsonAsset = (new ClassReference()).init();
		newJsonAsset.setUrl(aUrl);
		return newJsonAsset;
	};
});