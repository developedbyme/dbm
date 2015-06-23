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
	var CurveEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
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
		
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(3));
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(2));
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(4));
		
		var pointSet = PointSet.createWithLength(2, 4);
		console.log(pointSet);
		
		var pointSet = PointSet.createWithValues([0, 0, 50, 0, 50, 50, 0, 50], 2);
		console.log(pointSet);
		
		var roundedCurve = BezierCurve.createWithLength(3, true, 4*4);
		CurveEvaluator.getInstance().createMultiSegmentBezierCurveFromPoints2d(pointSet.pointsArray, roundedCurve, true);
		console.log(roundedCurve);
		
		var fullCurve = BezierCurve.createWithLength(3, true, 4);
		CurveEvaluator.getInstance().createBezierCurveFromPoints2d(pointSet.pointsArray, fullCurve, [0, 0.333, 0.667, 1]);
		console.log(fullCurve);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});