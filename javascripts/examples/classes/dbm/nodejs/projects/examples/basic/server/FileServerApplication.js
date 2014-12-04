/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.projects.examples.basic.server.FileServerApplication", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var FileServerApplication = dbm.importClass("dbm.nodejs.projects.examples.basic.server.FileServerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var WebServer = dbm.importClass("dbm.nodejs.server.WebServer");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.nodejs.projects.examples.basic.server.FileServerApplication::_init");
		
		this.superCall();
		
		this._server = null;
		
		return this;
	};
	
	objectFunctions.start = function() {
		console.log("dbm.nodejs.projects.examples.basic.server.FileServerApplication::start");
		
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