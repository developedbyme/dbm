/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication", "com.developedbyme.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SaveStreamApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var FileWriter = dbm.importClass("com.developedbyme.nodejs.utils.file.FileWriter");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._dataLoaded = function(aScreenName, aData) {
		console.log("com.developedbyme.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_dataLoaded");
		console.log(aScreenName, aData);
		
		var pathAsset = dbm.singletons.dbmAssetRepository.getAsset("assets/temp/twitter/streams/" + aScreenName + ".json");
		
		var writer = FileWriter.create(pathAsset.getUrl());
		writer.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.SAVED, CallFunctionCommand.createCommand(this, this._dataSaved, []));
		
		writer.setData(aData);
		writer.write();
	};
	
	objectFunctions._dataSaved = function() {
		console.log("com.developedbyme.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_dataSaved");
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});