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
	var BooleanSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.BooleanSwitchedNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ApiFunctions = dbm.importClass("dbm.thirdparty.facebook.ApiFunctions");
	
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
		this._facebookDetailsTemplate = "assets/templates.html#facebookDetails";
		
		this._facebookApi = FacebookApi.create("450882664974319");
		
		this._assetsLoader.addLoader(this._facebookApi.getLoader());
		this._assetsLoader.addAssetsByPath(this._mainTemplate, this._facebookDetailsTemplate);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplate, {}, true, this._contentHolder, true);
		var mainController = templateResult.mainController;
		console.log(templateResult);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._facebookDetailsTemplate, {}, false, templateResult.rootElement, true);
		var facebookDetails = templateResult.mainController;
		console.log(templateResult);
		
		var nameText = templateResult.getController("name");
		var profileImage = templateResult.getController("profileImage");
		
		console.log(this._facebookApi);
		
		var graphData = this._facebookApi.getGraphData("me");
		graphData.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._showUserData, [graphData]));
		
		facebookDetails.setPropertyInput("inDom", graphData.getProperty("loaded"));
		facebookDetails.getProperty("display").startUpdating();
		
		nameText.setPropertyInput("text", graphData.parsedData.getVariableProperty("name"));
		nameText.getProperty("display").startUpdating();
		
		var composedUrlProperty = profileImage.createProperty("composedUrl", null);
		composedUrlProperty.setAsDirty();
		
		profileImage.createUpdateFunctionWithArguments(
			"url", 
			ApiFunctions.createProfileImageUrl,
			[
				profileImage.createProperty("id", this._facebookApi.getProperty("userId")),
				profileImage.createProperty("width", 96),
				profileImage.createProperty("height", 96)
			],
			[composedUrlProperty]
		);
		var switchNode = profileImage.addDestroyableObject(BooleanSwitchedNode.create(this._facebookApi.getProperty("connected"), composedUrlProperty));
		switchNode.getProperty("falseValue").setValue(null);
		profileImage.setPropertyInput("source", switchNode.getProperty("outputValue"));
		
		profileImage.getProperty("display").startUpdating();
		
		this._facebookApi.getExtendedEvent().addCommandToEvent(AccessExtendedEventIds.SIGNED_IN, CallFunctionCommand.createCommand(graphData, graphData.load, []));
		this._facebookApi.checkLogin();
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