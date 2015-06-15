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
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var OneTouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.OneTouchOrMouseDetector");
	var DrawInteraction = dbm.importClass("dbm.gui.abstract.touch.draw.DrawInteraction");
	var GetMaxParameterOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var CurveDrawer2d = dbm.importClass("dbm.utils.canvas.CurveDrawer2d");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
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
		
		var holder = DisplayBaseObject.createDiv(this._contentHolder, true, {"style": "position: relative; overflow: hidden;"});
		holder.setElementAsSized();
		holder.getProperty("width").setValue(1024);
		holder.getProperty("height").setValue(768);
		holder.getProperty("display").update();
		
		var canvas = CanvasView.create(holder.getElement(), true, "2d");
		canvas.setElementAsSized();
		canvas.getProperty("width").setValue(1024);
		canvas.getProperty("height").setValue(768);
		var canvasController = canvas.getController();
		
		var touchDetector = OneTouchOrMouseDetector.create(holder.getElement());
		var drawInteraction = DrawInteraction.create(touchDetector);
		
		drawInteraction.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.NEW, CallFunctionCommand.createCommand(this, this.createNewDrawing, [canvasController.getLayer("main"), GetVariableObject.createSelectDataCommand()]));
		
		touchDetector.activate();
		canvasController.getProperty("display").startUpdating();
	};
	
	objectFunctions.createNewDrawing = function(aLayer, aDrawingData) {
		//console.log("Application::createNewDrawing");
		//console.log(aLayer, aDrawingData);
		
		var newLayer = aLayer.getChildByPath(dbm.singletons.dbmIdManager.getNewId("layer"));
		
		var curveProperty = aDrawingData.getProperty("curve");
		
		var maxParameterNode = GetMaxParameterOnCurveNode.create(curveProperty);
		newLayer.setStrokeStyle(0, "#0000FF");
		
		var currentDrawingLayer = newLayer._getCurrentDrawingLayer();
		var curveDrawer = CurveDrawer2d.create(curveProperty.getValue());
		currentDrawingLayer.addCurve(curveDrawer);
		
		curveDrawer.getProperty("curve").connectInput(curveProperty);
		curveDrawer.getProperty("endParameter").connectInput(maxParameterNode.getProperty("outputParameter"));
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});