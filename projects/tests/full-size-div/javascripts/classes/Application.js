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
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	
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
		
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		var placeElementNode = (new PlaceElementNode()).init();
		placeElementNode.getProperty("element").setValue(dbm.getDocument().getElementById("placement"));
		
		dbm.singletons.dbmFlowManager.connectProperties(windowSizeNode.getProperty("width"), placeElementNode.getProperty("width"));
		dbm.singletons.dbmFlowManager.connectProperties(windowSizeNode.getProperty("height"), placeElementNode.getProperty("height"));
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(placeElementNode.getProperty("display"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});