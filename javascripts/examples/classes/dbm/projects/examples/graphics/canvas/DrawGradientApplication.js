/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Examples that draws gradinets to a canvas
 */
dbm.registerClass("dbm.projects.examples.graphics.canvas.DrawGradientApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var DrawGradientApplication = dbm.importClass("dbm.projects.examples.graphics.canvas.DrawGradientApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var CssLanguageFunctions = dbm.importClass("dbm.utils.native.string.CssLanguageFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.graphics.canvas.DrawGradientApplication::_init");
		
		this.superCall();
		
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		this.addCssLink("../styles/utils/spacing.css");
		this.addCssLink("../styles/utils/backgrounds.css");
		this.addCssLink("../styles/dbm/examples/boxes.css");
		this.addCssLink("../styles/dbm/gui/textFields.css");
		this.addCssLink("../styles/dbm/gui/form.css");
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.graphics.canvas.DrawGradientApplication::_createPage");
		
		
		var canvasView = CanvasView.create(this._contentHolder, true, "2d");
		var canvasController = canvasView.getController();
		canvasView.setElementAsSized();
		canvasView.getProperty("width").setValue(1024);
		canvasView.getProperty("height").setValue(768);
		
		var displayLayer = canvasController.getLayer("/main");
		displayLayer.getProperty("scaleX").setValue(1);
		displayLayer.getProperty("scaleY").setValue(1);
		
		this._createSquareLayer(canvasController.getLayer("/main/redYellow"), 0, 0, 100, 100, canvasController.createLinearGradient(0, 0, 100, 0, CssLanguageFunctions.createGradientFromCss("linear-gradient(left, #FF0000 0%, #FFFF00 100%)")));
		var redYellowBigLayer = this._createSquareLayer(canvasController.getLayer("/main/redYellowBig"), 150, 150, 100, 100, canvasController.createLinearGradient(0, 0, 100, 0, CssLanguageFunctions.createGradientFromCss("linear-gradient(left, #FF0000 0%, #FFFF00 100%)")));
		redYellowBigLayer.getProperty("scaleX").setValue(2);
		redYellowBigLayer.getProperty("scaleY").setValue(2);
		
		this._createSquareLayer(canvasController.getLayer("/main/blueWhite"), 200, 0, 100, 100, canvasController.createLinearGradient(0, 0, 0, 100, CssLanguageFunctions.createGradientFromCss("linear-gradient(left, #FFFFFF 0%, #0000FF 50%, #FFFFFF 100%)")));
		
		this._createSquareLayer(canvasController.getLayer("/main/blackWhite"), 0, 200, 100, 100, canvasController.createRadialGradient(50, 50, 10, 50, 50, 100, CssLanguageFunctions.createGradientFromCss("linear-gradient(left, #000000 0%, #FFFFFF 100%)")));
		this._createSquareLayer(canvasController.getLayer("/main/blackWhite2"), 0, 400, 100, 100, canvasController.createRadialGradient(0, 0, 10, 100, 100, 20, CssLanguageFunctions.createGradientFromCss("linear-gradient(left, #000000 0%, #FFFFFF 100%)")));
		
		
		canvasController.getProperty("display").update();
	};
	
	objectFunctions._createSquareLayer = function(aLayer, aX, aY, aWidth, aHeight, aGradient) {
		aLayer.getProperty("x").setValue(aX);
		aLayer.getProperty("y").setValue(aY);
		
		aLayer.setStrokeStyle(0, "#000000");
		aLayer.setFillStyle(aGradient);
		aLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(0, 0, aWidth, aHeight));
		
		return aLayer;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});