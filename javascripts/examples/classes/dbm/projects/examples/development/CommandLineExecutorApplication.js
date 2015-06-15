/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application of using a commnad line executor.
 */
dbm.registerClass("dbm.projects.examples.development.CommandLineExecutorApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var CommandLineExecutorApplication = dbm.importClass("dbm.projects.examples.development.CommandLineExecutorApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("dbm.utils.development.CommandLineExecutor");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.development.CommandLineExecutorApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	/**
	 * Creates the page.
	 *
	 * @param	aTemplatePath	The path to the template that is used to create the page.
	 */
	objectFunctions._createPage = function(aTemplatePath) {
		console.log("dbm.projects.examples.development.CommandLineExecutorApplication::_createPage");
		
		var theExecutor = CommandLineExecutor.create();
		console.log(theExecutor);
		
		theExecutor.executeScript("console.log(\"first call\"); var test = \"12345\", x = 3; var testFunction = function(aX, aY) {var test2 = true};");
		theExecutor.executeScript("console.log(\"second call\"); console.log(test);");
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});