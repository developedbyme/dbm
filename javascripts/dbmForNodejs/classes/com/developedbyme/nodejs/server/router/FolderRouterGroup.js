dbm.registerClass("com.developedbyme.nodejs.server.router.FolderRouterGroup", "com.developedbyme.nodejs.server.router.RouterGroup", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup");
	//"use strict";
	
	var url = require("url");
	
	var FolderRouterGroup = dbm.importClass("com.developedbyme.nodejs.server.router.FolderRouterGroup");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var ProcessExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ProcessExtendedEventIds");
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::_init");
		
		this.superCall();
		
		this._isExclusive = true;
		this._folderPath = null;
		
		return this;
	};
	
	objectFunctions._preCheckRouting = function(aRoutedData) {
		var currentPath = url.parse(theRequest.url).pathname;
		
		if(currentPath.indexOf(this._folderPath) !== 0) {
			return false;
		}
		
		return true;
	};
	
	objectFunctions.setFolderPath = function(aFolderPath) {
		this._folderPath = aFolderPath;
		
		return this;
	}
	
	staticFunctions.create = function(aFolderPath) {
		//console.log("com.developedbyme.nodejs.server.router.FolderRouterGroup::create");
		//console.log(aElement);
		
		var newFolderRouterGroup = (new ClassReference()).init();
		
		newFolderRouterGroup.setFolderPath(aFolderPath);
		
		return newFolderRouterGroup;
	};
});