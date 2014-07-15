/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application of using a commnad line executor with input from an editor.
 */
dbm.registerClass("com.developedbyme.projects.examples.development.CommandLineEditorApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var CommandLineEditorApplication = dbm.importClass("com.developedbyme.projects.examples.development.CommandLineEditorApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("com.developedbyme.utils.development.CommandLineExecutor");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	
	//Libraries
	var CodeMirror = dbm.importLibrary("CodeMirror", function() {CodeMirror = CodeMirror.realLibrary;});
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.development.CommandLineEditorApplication::_init");
		
		this.superCall();
		
		this._executor = null;
		this._editor = null;
		this._executeButton = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	/**
	 * Creates the page.
	 *
	 * @param	aTemplatePath	The path to the template that is used to create the page.
	 */
	objectFunctions._createPage = function(aTemplatePath) {
		console.log("com.developedbyme.projects.examples.development.CommandLineEditorApplication::_createPage");
		
		this._executor = CommandLineExecutor.create();
		console.log(this._executor);
		
		this._editor = CodeMirror(dbm.getDocument().body, {
		  value: "console.log(\"test\");\n",
		  mode:  "javascript"
		});
		console.log(this._editor);
		
		this._executeButton = BaseButton.createButton(dbm.getDocument().body, true, {}, "Execute").activate();
		this._executeButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._executeCurrentScript, []));
	};
	
	objectFunctions._executeCurrentScript = function() {
		console.log("com.developedbyme.projects.examples.development.CommandLineEditorApplication::_executeCurrentScript");
		var currentScript = this._editor.getValue();
		console.log(currentScript);
		this._executor.executeScript(currentScript);
		this._editor.setValue("");
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});