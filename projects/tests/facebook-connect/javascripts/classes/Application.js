/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var FacebookApi = dbm.importClass("dbm.thirdparty.facebook.FacebookApi");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var AccessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.AccessExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._mainTemplate = "assets/templates.html#main";
		
		this._facebookApi = FacebookApi.create("450882664974319");
		
		this._assetsLoader.addLoader(this._facebookApi.getLoader());
		this._assetsLoader.addAssetsByPath(this._mainTemplate);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplate, {}, true, this._contentHolder, true);
		var mainController = templateResult.mainController;
		
		console.log(this._facebookApi);
		
		this._facebookApi.getExtendedEvent().addCommandToEvent(AccessExtendedEventIds.SIGNED_IN, CallFunctionCommand.createCommand(this, this._loadUserData, []));
		this._facebookApi.login();
	};
	
	objectFunctions._loadUserData = function() {
		console.log("Application::_loadUserData");
		
		var graphData = this._facebookApi.getGraphData("me");
		
		//METODO: add listener
		graphData.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._showUserData, [graphData]));
		
		graphData.load();
	};
	
	objectFunctions._showUserData = function(aGraphData) {
		console.log("Application::_showUserData");
		console.log(aGraphData);
		console.log(aGraphData.getProperty("data").getValue());
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});