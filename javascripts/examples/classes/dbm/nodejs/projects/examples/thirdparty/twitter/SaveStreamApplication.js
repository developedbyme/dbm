/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication", "dbm.nodejs.projects.examples.thirdparty.twitter.ReadStreamApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SaveStreamApplication = dbm.importClass("dbm.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var FileWriter = dbm.importClass("dbm.nodejs.utils.file.FileWriter");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._dataLoaded = function(aScreenName, aData) {
		console.log("dbm.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_dataLoaded");
		console.log(aScreenName, aData);
		
		var pathAsset = dbm.singletons.dbmAssetRepository.getAsset("assets/temp/twitter/streams/" + aScreenName + ".json");
		
		var writer = FileWriter.create(pathAsset.getUrl());
		writer.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.SAVED, CallFunctionCommand.createCommand(this, this._dataSaved, []));
		
		writer.setData(aData);
		writer.write();
	};
	
	objectFunctions._dataSaved = function() {
		console.log("dbm.nodejs.projects.examples.thirdparty.twitter.SaveStreamApplication::_dataSaved");
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});