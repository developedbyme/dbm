/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application of using a commnad line executor.
 */
dbm.registerClass("com.developedbyme.projects.examples.development.CommandLineExecutorApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var CommandLineExecutorApplication = dbm.importClass("com.developedbyme.projects.examples.development.CommandLineExecutorApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("com.developedbyme.utils.development.CommandLineExecutor");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.development.CommandLineExecutorApplication::_init");
		
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
		console.log("com.developedbyme.projects.examples.development.CommandLineExecutorApplication::_createPage");
		
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