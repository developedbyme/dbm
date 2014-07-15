/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.server.router.FolderRouterGroup", "com.developedbyme.nodejs.server.router.RouterGroup", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup");
	//"use strict";
	
	var url = require("url");
	
	//Self reference
	var FolderRouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.FolderRouterGroup");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var StartsWithQualifier = dbm.importClass("com.developedbyme.nodejs.server.router.qualifiers.StartsWithQualifier");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var CallFunctionObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var SelectBaseObjectObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.SelectBaseObjectObject");
	
	//Constants
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::_init");
		
		this.superCall();
		
		this._isExclusive = true;
		
		var qualifier = StartsWithQualifier.create(
			null,
			CallFunctionObject.createFunctionOnObjectCommand(
				SelectBaseObjectObject.createCommand(),
				"getLocalPath",
				[]
			)
		);
		this.addQualifier(qualifier);
		
		this._folderPathReevaluator = qualifier.searchStringEvaluator;
		
		return this;
	};
	
	objectFunctions._performRoute = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::_performRoute");
		
		var currentPath = aRoutedData.getLocalPath();
		
		var folderPath = this._folderPathReevaluator.reevaluationData;
		currentPath += currentPath.substring(folderPath.length+1, currentPath.length);
		aRoutedData.setLocalPath(currentPath);
		
		return this.superCall(aRoutedData);
	};
	
	objectFunctions._routerDone = function(aRoutedData) {
		console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::_routerDone");
		
		aRoutedData.stopUsingCurrentLocalPath();
		
		this.superCall(aRoutedData);
	};
	
	objectFunctions.setFolderPath = function(aFolderPath) {
		this._folderPathReevaluator.reevaluationData = aFolderPath;
		
		return this;
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		this._folderPathReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aFolderPath) {
		//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::create");
		//console.log(aElement);
		
		var newFolderRouterGroup = ClassReference._createAndInitClass(ClassReference);
		
		newFolderRouterGroup.setFolderPath(aFolderPath);
		
		return newFolderRouterGroup;
	};
});