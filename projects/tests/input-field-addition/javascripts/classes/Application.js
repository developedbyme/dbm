/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var InputField = dbm.importClass("dbm.gui.form.InputField");
	var HtmlInputTypes = dbm.importClass("dbm.constants.htmldom.HtmlInputTypes");
	var ParseFloatNode = dbm.importClass("dbm.flow.nodes.parse.ParseFloatNode");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._addTemplate("main", "assets/templates.html#main");
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		//var templateResult = this._createControllerFromTemplate("main");
		//var mainController = templateResult.mainController;
		
		var htmlCreator = dbm.singletons.dbmWindowManager.getMasterWindow().getHtmlCreator();
		var form = htmlCreator.createForm("#", "GET");
		var fieldElement1 = htmlCreator.createInput("field1", HtmlInputTypes.TEXT);
		var fieldElement2 = htmlCreator.createInput("field2", HtmlInputTypes.TEXT);
		var fieldElement3 = htmlCreator.createInput("field3", HtmlInputTypes.TEXT);
		
		this._contentHolder.appendChild(fieldElement1);
		this._contentHolder.appendChild(fieldElement2);
		this._contentHolder.appendChild(fieldElement3);
		
		var field1 = InputField.create(fieldElement1, "first value").activate();
		var field2 = InputField.create(fieldElement2, "second value").activate();
		var field3 = InputField.create(fieldElement3).activate();
		
		var additionNode = AdditionNode.create(ParseFloatNode.create(field1.getProperty("value")).getProperty("outputValue"), ParseFloatNode.create(field2.getProperty("value")).getProperty("outputValue"));
		field3.setPropertyInput("value", additionNode.getProperty("outputValue"));
		
		field3.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});