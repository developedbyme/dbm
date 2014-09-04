/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.projects.examples.dbmgraphics.DrawLogoApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var DrawLogoApplication = dbm.importClass("com.developedbyme.projects.examples.dbmgraphics.DrawLogoApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var LogoGenerator = dbm.importClass("com.developedbyme.dbmgraphics.graphicscreators.LogoGenerator");
	
	//Constants
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.FormFieldExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.dbmgraphics.DrawLogoApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.projects.examples.dbmgraphics.DrawLogoApplication::_createPage");
		
		var width = 140;
		var heightRatio = Math.sqrt(0.75);
		var height = Math.ceil(width*heightRatio);
		var lineWidth = 0;
		
		var logoPaths = LogoGenerator.createDbmLogo(width);
		console.log(logoPaths);
		
		var canvasView = CanvasView.create(dbm.getDocument(), true, "2d", {"width": width+lineWidth, "height": height+lineWidth});
		
		var centerLayer = canvasView.getController().getLayer("/center");
		centerLayer.getProperty("x").setValue(0.5*lineWidth);
		centerLayer.getProperty("y").setValue(height+0.5*lineWidth);
		centerLayer.getProperty("scaleY").setValue(-1);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/d");
		//graphicsLayer.setStrokeStyle(lineWidth, "#000000");
		graphicsLayer.setFillStyle("#66ccff");
		graphicsLayer.drawCurve(logoPaths[0], 0, 3);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/b");
		//graphicsLayer.setStrokeStyle(lineWidth, "#FFFFFF");
		graphicsLayer.setFillStyle("#ccffff");
		graphicsLayer.drawCurve(logoPaths[1], 0, 5);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/m1");
		//graphicsLayer.setStrokeStyle(lineWidth, "#FFFFFF");
		graphicsLayer.setFillStyle("#333399");
		graphicsLayer.drawCurve(logoPaths[2], 0, 3);
		
		var graphicsLayer = canvasView.getController().getLayer("/center/m2");
		//graphicsLayer.setStrokeStyle(lineWidth, "#FFFFFF");
		graphicsLayer.setFillStyle("#333399");
		graphicsLayer.drawCurve(logoPaths[3], 0, 3);
		
		canvasView.getController().debugTraceStructure();
		canvasView.getController().getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});