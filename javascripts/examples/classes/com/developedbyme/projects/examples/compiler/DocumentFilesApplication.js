/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example of how to document a project.
 */
dbm.registerClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DocumentFilesApplication = dbm.importClass("com.developedbyme.projects.examples.compiler.DocumentFilesApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DbmCompiler = dbm.importClass("com.developedbyme.compiler.DbmCompiler");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_createPage");
		
		var compiler = (new DbmCompiler()).init();
		
		compiler.setNumberOfFilesBeforeImport(3);
		compiler.addFiles("../javascripts/dbm/dbm.js", "../javascripts/dbm/setup/defaultDocumentSetup.js", "../javascripts/dbm/classes/com/developedbyme/core/globalobjects/classmanager/ClassManager.js", "../javascripts/dbm/setup/defaultSetup.js", "../javascripts/dbm/setup/compiledStart.js", "../javascripts/tests/inverseKinematicTest.js");
		compiler._loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._generateDocumentation, [compiler]));
		compiler.load();
	};
	
	objectFunctions._generateDocumentation = function(aCompiler) {
		console.log("com.developedbyme.projects.examples.compiler.DocumentFilesApplication::_generateDocumentation");
		console.log(aCompiler);
		aCompiler.documentFiles();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});