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
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
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
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		
		canvasView.getController()._numberOfLinksToResolve = 400;
		
		var centerLayer = canvasView.getController().getLayer("/center");
		centerLayer.getProperty("x").setValue(100);
		centerLayer.getProperty("y").setValue(70);
		
		var moveLayer = canvasView.getController().getLayer("/center/move");
		moveLayer.getProperty("rotate").setValue(2*Math.PI/(canvasView.getController()._numberOfLinksToResolve+1));
		moveLayer.getProperty("rotate").animateValue(2*Math.PI-0.005, 60, "linear");
		moveLayer.getProperty("alpha").setValue(0.98);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/move/graphics");
		graphicsLayer.setStrokeStyle(0, "#FF0000");
		graphicsLayer.lineTo(20, 20);
		graphicsLayer.bezierCurveTo(30, 0, 50, 30, 60, 50);
		
		var graphicsLayer = canvasView.getController().createLink("/center/move/copy", "/center/move");
		
		canvasView.getController().debugTraceStructure();
		canvasView.getController().getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});