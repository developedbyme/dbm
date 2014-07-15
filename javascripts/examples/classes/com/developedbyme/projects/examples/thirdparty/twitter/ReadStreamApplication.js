/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.thirdparty.twitter.ReadStreamApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ReadStreamApplication = dbm.importClass("com.developedbyme.projects.examples.thirdparty.twitter.ReadStreamApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var JsonAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.JsonAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var OauthSetupFunctions = dbm.importClass("com.developedbyme.utils.authorization.OauthSetupFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.thirdparty.twitter.ReadStreamApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("com.developedbyme.projects.examples.thirdparty.twitter.ReadStreamApplication::_load");
		
		//var loader = JsonAsset.create("https://api.twitter.com/1.1/statuses/user_timeline.json");
		var loader = JsonAsset.create("http://192.168.109.114/1.1/statuses/user_timeline.json");
		var parameters = {"screen_name": "developedbyme"};
		
		OauthSetupFunctions.setupAssetWithOauth(
			loader,
			parameters,
			"insert-consumer-key", /* Consumer key */
			"insert-consumer-secret", /* Consumer secret */
			"insert-token", /* Token */
			"insert-token-secret" /* Token secret */
		);
		
		loader.load();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});