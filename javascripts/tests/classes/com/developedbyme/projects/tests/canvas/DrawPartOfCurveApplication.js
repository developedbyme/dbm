/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of drawing just a part of a curve.
 */
dbm.registerClass("com.developedbyme.projects.tests.canvas.DrawPartOfCurveApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawPartOfCurveApplication = dbm.importClass("com.developedbyme.projects.tests.canvas.DrawPartOfCurveApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.tests.canvas.DrawPartOfCurveApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.tests.canvas.DrawPartOfCurveApplication::_createPage");
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(1024);
		canvasView.getProperty("height").setValue(768);
		var canvasController = canvasView.getController();
		
		var mainLayer = canvasController.getLayer("main");
		
		var mainCurve = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(3, true, "10,10; 100,300; 400,150; 600,50");
		
		var drawLayer = canvasController.getLayer("main/mainCurve/full");
		drawLayer.setStrokeStyle(1, "#FF9999");
		drawLayer.drawCurve(mainCurve);
		
		var drawLayer = canvasController.getLayer("main/mainCurve/end");
		drawLayer.setStrokeStyle(1, "#00FF00");
		drawLayer.drawCurve(mainCurve, 0.5);
		
		var drawLayer = canvasController.getLayer("main/mainCurve/start");
		drawLayer.setStrokeStyle(1, "#0000FF");
		drawLayer.drawCurve(mainCurve, 0.1, 0.32);
		
		canvasController.getProperty("display").startUpdating();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});