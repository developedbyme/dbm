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
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		//this._mainTemplate = "assets/templates.html#main";
		//this._assetsLoader.addAssetsByPath(this._mainTemplate);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var sideLength = 100;
		
		var grid = PointSet.createWithLength(Math.pow(sideLength, 2));
		
		var canvas = CanvasView.create(this._contentHolder, true, "2d", {"width": 1024, "height": 768});
		var canvasConteroller = canvas.getController();
		
		canvasConteroller.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});