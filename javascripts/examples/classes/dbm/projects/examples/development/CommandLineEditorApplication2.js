/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application of using a commnad line executor with input from an editor (in a code mirror view).
 */
dbm.registerClass("dbm.projects.examples.development.CommandLineEditorApplication2", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var CommandLineEditorApplication2 = dbm.importClass("dbm.projects.examples.development.CommandLineEditorApplication2");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CommandLineExecutor = dbm.importClass("dbm.utils.development.CommandLineExecutor");
	var CodeMirrorView = dbm.importClass("dbm.thirdparty.codemirror.CodeMirrorView");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.development.CommandLineEditorApplication2::_init");
		
		this.superCall();
		
		this._executor = null;
		this._codeMirrorView = null;
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
		console.log("dbm.projects.examples.development.CommandLineEditorApplication2::_createPage");
		
		this._executor = CommandLineExecutor.create();
		console.log(this._executor);
		
		var executeKeyMap = "Shift-Enter";
		var executeCommand = CallFunctionCommand.createCommand(this, this._executeCurrentScript, []);
		
		this._codeMirrorView = CodeMirrorView.createOnParent(dbm.getDocument().body, true, {}, "console.log(\"test\");");
		this._codeMirrorView.addKeyMap(executeKeyMap, executeCommand);
		this._codeMirrorView.activate();
		
		this._executeButton = BaseButton.createButton(dbm.getDocument().body, true, {}, "Execute").activate();
		this._executeButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, executeCommand);
	};
	
	objectFunctions._executeCurrentScript = function() {
		console.log("dbm.projects.examples.development.CommandLineEditorApplication2::_executeCurrentScript");
		var currentScript = this._codeMirrorView.getValue();
		console.log(currentScript);
		this._executor.executeScript(currentScript);
		this._codeMirrorView.setValue("");
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});