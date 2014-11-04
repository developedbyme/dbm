/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for drawing shapes.
 */
dbm.registerClass("com.developedbyme.utils.canvas.graphics.DrawShapeFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.graphics.DrawShapeFunctions");
	
	//Self reference
	var DrawShapeFunctions = dbm.importClass("com.developedbyme.utils.canvas.graphics.DrawShapeFunctions");
	
	//Error report
	
	//Dependnecies
	var CanvasGraphics2d = dbm.importClass("com.developedbyme.utils.canvas.CanvasGraphics2d");
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var CreateCircleCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateCircleCurveNode");
	var GetMaxParameterOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetMaxParameterOnCurveNode");
	var CreateLineFromCenterNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateLineFromCenterNode");
	var CreateLineFromPointNode = dbm.importClass("com.developedbyme.flow.nodes.curves.CreateLineFromPointNode");
	
	//Utils
	
	//Constants
	
	staticFunctions.createCircleCurveDrawer = function(aX, aY, aRadius) {
		var curveCreatorNode = CreateCircleCurveNode.create(aX, aY, aRadius);
		var maxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorNode.getProperty("outputCurve"));
		
		var newCurveDrawer = CurveDrawer2d.create(curveCreatorNode.getProperty("outputCurve"), 0, maxParameterNode.getProperty("outputParameter"));
		newCurveDrawer.addDestroyableObject(curveCreatorNode);
		newCurveDrawer.addDestroyableObject(maxParameterNode);
		
		return newCurveDrawer;
	};
	
	staticFunctions.drawCircle = function(aLayer, aX, aY, aRadius, aLineWidth, aStrokeStyle, aFillStyle) {
		//console.log("com.developedbyme.utils.canvas.graphics.DrawShapeFunctions::drawCircle");
		//console.log(aLayer, aX, aY, aRadius, aLineWidth, aStrokeStyle, aFillStyle);
		
		var graphics = CanvasGraphics2d.createWithSettings(aLineWidth, aStrokeStyle, aFillStyle);
		graphics.addCurve(ClassReference.createCircleCurveDrawer(aX, aY, aRadius));
		
		aLayer.addDrawingPart(graphics);
		
		return aLayer;
	};
	
	staticFunctions.createCurveDrawerForLine = function(aX, aY, aLength, aAngle) {
		var curveCreatorNode = CreateLineFromCenterNode.create(aX, aY, aLength, aAngle);
		var maxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorNode.getProperty("outputCurve"));
		
		var newCurveDrawer = CurveDrawer2d.create(curveCreatorNode.getProperty("outputCurve"), 0, maxParameterNode.getProperty("outputParameter"));
		newCurveDrawer.addDestroyableObject(curveCreatorNode);
		newCurveDrawer.addDestroyableObject(maxParameterNode);
		
		return newCurveDrawer;
	};
	
	staticFunctions.createCurveDrawerForLineFromPoint = function(aX, aY, aLength, aAngle) {
		var curveCreatorNode = CreateLineFromPointNode.create(aX, aY, aLength, aAngle);
		var maxParameterNode = GetMaxParameterOnCurveNode.create(curveCreatorNode.getProperty("outputCurve"));
		
		var newCurveDrawer = CurveDrawer2d.create(curveCreatorNode.getProperty("outputCurve"), 0, maxParameterNode.getProperty("outputParameter"));
		newCurveDrawer.addDestroyableObject(curveCreatorNode);
		newCurveDrawer.addDestroyableObject(maxParameterNode);
		
		return newCurveDrawer;
	};
	
	staticFunctions.drawCross = function(aLayer, aX, aY, aWidth, aHeight, aAngle, aLineWidth, aStrokeStyle) {
		
		var graphics = CanvasGraphics2d.createWithSettings(aLineWidth, aStrokeStyle);
		graphics.moveWhenSwitchingCurves = true;
		
		graphics.addCurve(ClassReference.createCurveDrawerForLine(aX, aY, aWidth, aAngle));
		graphics.addCurve(ClassReference.createCurveDrawerForLine(aX, aY, aHeight, aAngle+0.5*Math.PI));
		
		aLayer.addDrawingPart(graphics);
		
		return aLayer;
	};
	
	staticFunctions.drawAngle = function(aLayer, aX, aY, aLength, aAngle1, aAngle2, aLineWidth, aStrokeStyle) {
		
		var graphics = CanvasGraphics2d.createWithSettings(aLineWidth, aStrokeStyle);
		graphics.moveWhenSwitchingCurves = true;
		
		graphics.addCurve(ClassReference.createCurveDrawerForLineFromPoint(aX, aY, aLength, aAngle1));
		graphics.addCurve(ClassReference.createCurveDrawerForLineFromPoint(aX, aY, aLength, aAngle2));
		
		aLayer.addDrawingPart(graphics);
		
		return aLayer;
	};
});