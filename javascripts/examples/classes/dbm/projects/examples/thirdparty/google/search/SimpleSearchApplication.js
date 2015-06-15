/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.thirdparty.google.search.SimpleSearchApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SimpleSearchApplication = dbm.importClass("dbm.projects.examples.thirdparty.google.search.SimpleSearchApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.thirdparty.google.search.SimpleSearchApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("dbm.projects.examples.thirdparty.google.search.SimpleSearchApplication::_load");
		
		var key = "AIzaSyCtZDKih6gjAI34VF4qXr28Nn-Z7uA7cPs";
		var engineId = "007826195105171803720:r4vu66yn-b4";
		var searchQuery = "belgrade";
		
		var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + engineId + "&q=" + searchQuery;
		
		var loader = JsonAsset.create(url);
		loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._dataLoaded, [loader]));
		
		loader.load();
	};
	
	objectFunctions._dataLoaded = function(aLoader) {
		console.log("dbm.projects.examples.thirdparty.google.search.SimpleSearchApplication::_dataLoaded");
		console.log(aLoader.getData());
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._mapView = null;
		
		this.superCall();
	};
});