/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.gui.graphs.timeline.DrawTimelineApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawTimelineApplication = dbm.importClass("com.developedbyme.projects.examples.gui.graphs.timeline.DrawTimelineApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var DragAndDropExtendedEventSetup = dbm.importClass("com.developedbyme.core.extendedevent.setup.DragAndDropExtendedEventSetup");
	
	//Constants
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.gui.graphs.timeline.DrawTimelineApplication::_init");
		
		this.superCall();
		
		this._canvas = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.gui.graphs.timeline.DrawTimelineApplication::_createPage");
		
		var curve = BezierCurve.create(3, true);
		
		var animatedProperty = this.createProperty("animationValue", 0);
		animatedProperty.animateValue(5, 1.5, InterpolationTypes.LINEAR, 0);
		animatedProperty.animateValue(-3, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 1.5);
		animatedProperty.animateValue(7, 2, InterpolationTypes.QUADRATIC, 4);
		animatedProperty.setValueWithDelay(-8, 7.5);
		animatedProperty.animateValue(0, 2, InterpolationTypes.INVERTED_SINE, 8);
		animatedProperty.animateValue(-9, 0.5, InterpolationTypes.LINEAR, 9);
		
		dbm.singletons.dbmCurveCreator.createCurveFromTimeline(animatedProperty.getAnimationController(), 0, 10, 1024, 0, curve);
		
		console.log(curve);
		
		this._canvas = CanvasView.create(dbm.getDocument(), true, "2d", {"width": 1024, "height": 200});
		
		var centerLayer = this._canvas.getController().getLayer("/center");
		centerLayer.getProperty("y").setValue(100);
		centerLayer.getProperty("scaleX").setValue(1024/10);
		centerLayer.getProperty("scaleY").setValue(-10);
		
		var drawLayer = this._canvas.getController().getLayer("/center/line");
		drawLayer.setStrokeStyle(0, "#000000");
		drawLayer.drawCurve(curve);
		
		this._canvas.getController().getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});