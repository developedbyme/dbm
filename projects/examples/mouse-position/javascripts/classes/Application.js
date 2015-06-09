/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var PrintTextNode = dbm.importClass("dbm.flow.nodes.display.PrintTextNode");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		var printXTextNode = (new PrintTextNode()).init();
		printXTextNode.getProperty("element").setValue(dbm.getDocument().getElementById("positionX"));
		dbm.singletons.dbmFlowManager.connectProperties(mousePositionNode.getProperty("x"), printXTextNode.getProperty("text"));
		
		var printYTextNode = (new PrintTextNode()).init();
		printYTextNode.getProperty("element").setValue(dbm.getDocument().getElementById("positionY"));
		dbm.singletons.dbmFlowManager.connectProperties(mousePositionNode.getProperty("y"), printYTextNode.getProperty("text"));
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printXTextNode.getProperty("display"));
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printYTextNode.getProperty("display"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});