/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.server.SaveFileClientApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var SaveFileClientApplication = dbm.importClass("com.developedbyme.projects.examples.server.SaveFileClientApplication");
	
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
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.server.SaveFileClientApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._load, []);
		
		return this;
	};
	
	objectFunctions._load = function() {
		console.log("com.developedbyme.projects.examples.server.SaveFileClientApplication::_load");
		
		var loader = JsonAsset.create("http://localhost:8080/dbm/examples/saveFile");
		
		var currentDate = new Date();
		var dateString = currentDate.getUTCFullYear() + "-" + NumberFunctions.getPaddedNumber(currentDate.getUTCMonth()+1, 2) + "-" + NumberFunctions.getPaddedNumber(currentDate.getUTCDate()+1, 2);
		loader.setupAsFormObjectPost({"fileName": "saveFileClientApplication/" + dateString + "/test.txt", "dataEncoding": "ascii", "data": "Hello saved file."});
		
		loader.load();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});