/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var fs = require("fs");
	
	//Self reference
	var ReadStreamApplication = dbm.importClass("dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var HttpsLoadedAsset = dbm.importClass("dbm.nodejs.core.globalobjects.assetrepository.assets.HttpsLoadedAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var OauthSetupFunctions = dbm.importClass("dbm.utils.authorization.OauthSetupFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication::_load");
		
		var loader = HttpsLoadedAsset.create("https://api.twitter.com/1.1/statuses/user_timeline.json");
		
		var screenName = "developedbyme";
		
		var parameters = {"screen_name": screenName, "count": "20"};
		
		OauthSetupFunctions.setupAssetWithOauth(
			loader,
			parameters,
			"insert-consumer-key", /* Consumer key */
			"insert-consumer-secret", /* Consumer secret */
			"insert-token", /* Token */
			"insert-token-secret" /* Token secret */
		);
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._dataLoaded, [screenName, GetVariableObject.createSelectDataCommand()]));
		
		loader.load();
	};
	
	objectFunctions._dataLoaded = function(aScreenName, aData) {
		console.log("dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication::_dataLoaded");
		console.log(aScreenName, aData);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});