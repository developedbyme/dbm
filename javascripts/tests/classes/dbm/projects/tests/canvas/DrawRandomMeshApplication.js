/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of drawing a random mesh.
 */
dbm.registerClass("dbm.projects.tests.canvas.DrawRandomMeshApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DrawRandomMeshApplication = dbm.importClass("dbm.projects.tests.canvas.DrawRandomMeshApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var MersenneTwister = dbm.importClass("dbm.utils.random.MersenneTwister");
	
	//Utils
	var PointSetFunctions = dbm.importClass("dbm.utils.math.geometry.PointSetFunctions");
	var DrawShapeFunctions = dbm.importClass("dbm.utils.canvas.graphics.DrawShapeFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tests.canvas.DrawRandomMeshApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tests.canvas.DrawRandomMeshApplication::_createPage");
		
		var width = 1024;
		var height = 768;
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(width);
		canvasView.getProperty("height").setValue(height);
		var canvasController = canvasView.getController();
		
		var mainLayer = canvasController.getLayer("main");
		
		var randomNumberGenerator = MersenneTwister.create();
		randomNumberGenerator.initByUint(151363);
		
		var numberOfPoints = 5;
		var pointSet = PointSet.createWithLength(numberOfPoints);
		PointSetFunctions.setRandomPositions2d(pointSet.pointsArray, 0, 0, width, height, randomNumberGenerator);
		
		var pointLayer = canvasController.getLayer("main/points");
		var currentArray = pointSet.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0 ; i < currentArrayLength; i++) {
			var currentPoint = currentArray[i];
			DrawShapeFunctions.drawCircle(pointLayer, currentPoint.x, currentPoint.y, 10, 1, "#FF0000");
			DrawShapeFunctions.drawCross(pointLayer, currentPoint.x, currentPoint.y, 10, 10, 0, 1, "#FF0000");
		}
		
		var linesArray = new Array();
		dbm.singletons.dbmCurveCreator.createLinesBetweenAllPoints(pointSet.pointsArray, linesArray);
		
		
		
		var drawLayer = canvasController.getLayer("main/mesh");
		drawLayer._getCurrentDrawingLayer().moveWhenSwitchingCurves = true;
		drawLayer.setStrokeStyle(1, "#FF9999");
		
		
		
		var currentArray = linesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0 ; i < currentArrayLength; i++) {
			drawLayer.drawCurve(currentArray[i]);
		}
		
		canvasController.getProperty("display").startUpdating();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});