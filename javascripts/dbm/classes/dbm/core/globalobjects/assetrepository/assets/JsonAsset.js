/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset", "dbm.core.globalobjects.assetrepository.assets.XmlAsset", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var JavascriptEventIds = dbm.importClass("dbm.constants.htmlevents.JavascriptEventIds");
	var AssetStatusTypes = dbm.importClass("dbm.constants.status.AssetStatusTypes");
	var ReadyStateTypes = dbm.importClass("dbm.constants.status.ReadyStateTypes");
	var XmlHttpResponseTypes = dbm.importClass("dbm.constants.xml.XmlHttpResponseTypes");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.JsonAsset::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupData = function() {
		
		var parsed_data = null;
		
		try {
			var parsed_data = JSON.parse(this._loader.responseText);
		}
		catch(theError) {
			ErrorManager.getInstance().reportError(this, "_setupData", theError);
		}
		
		this._data.setValue(parsed_data);
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