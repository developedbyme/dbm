/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.projects.examples.basic.server.FileServerApplication", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var FileServerApplication = dbm.importClass("com.developedbyme.nodejs.projects.examples.basic.server.FileServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WebServer = dbm.importClass("com.developedbyme.nodejs.server.WebServer");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.nodejs.projects.examples.basic.server.FileServerApplication::_init");
		
		this.superCall();
		
		this._server = null;
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.nodejs.projects.examples.basic.server.FileServerApplication::start");
		
		this._server = WebServer.createHttpServer(8080, "/Library/WebServer/Documents");
		this._server.start();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._server = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return ClassReference._createAndInitClass(ClassReference);
	};
});