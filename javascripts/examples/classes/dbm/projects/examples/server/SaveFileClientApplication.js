/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.server.SaveFileClientApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SaveFileClientApplication = dbm.importClass("dbm.projects.examples.server.SaveFileClientApplication");
	
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
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.server.SaveFileClientApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("dbm.projects.examples.server.SaveFileClientApplication::_load");
		
		var loader = JsonAsset.create("http://localhost:8080/dbm/examples/saveFile");
		
		var currentDate = new Date();
		var dateString = IsoDate.getIsoDate(currentDate);
		loader.setupAsFormObjectPost({"fileName": "saveFileClientApplication/" + dateString + "/test.txt", "dataEncoding": "ascii", "data": "Hello saved file."});
		
		loader.load();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});