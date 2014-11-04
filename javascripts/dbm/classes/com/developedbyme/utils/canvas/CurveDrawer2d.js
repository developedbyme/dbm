/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A graphics in a 2d canvas.
 */
dbm.registerClass("com.developedbyme.utils.canvas.CurveDrawer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	//Self reference
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependnecies
	var GetPartOfCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetPartOfCurveNode");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::_init");
		
		this.superCall();
		
		this._startParameter = this.createProperty("startParameter", 0);
		this._endParameter = this.createProperty("endParameter", 0);
		this._curve = this.createProperty("curve", null).setAlwaysUpdateFlow(true);
		
		this._getPartOfCurveNode = this.addDestroyableObject(GetPartOfCurveNode.create(this._curve, this._startParameter, this._endParameter));
		this._drawCurve = this.createProperty("drawCurve", this._getPartOfCurveNode.getProperty("outputCurve")).setAlwaysUpdateFlow(true);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create());
		this._graphicsUpdate.connectInput(this._drawCurve);
		
		return this;
	};
	
	/**
	 * Draws the contents to a canvas context.
	 *
	 * @param	aContext	CanvasRenderingContext2D	The canvas context to draw on.
	 */
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::draw");
		
		var drawCurve = this._drawCurve.getValueWithoutFlow();
		
		switch(drawCurve.getCurveDegree()) {
			case 1:
				ClassReference._drawPoints1stDegree(aContext, drawCurve.pointsArray);
				break;
			case 2:
				ClassReference._drawPointsCompact2ndDegree(aContext, drawCurve.pointsArray);
				break;
			case 3:
				ClassReference._drawPointsCompact3rdDegree(aContext, drawCurve.pointsArray);
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "draw", "Can't draw bezier curve of degree " + degree + ".");
				break;
		}
	};
	
	objectFunctions.getStartPoint = function(aReturnPoint) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::getStartPoint");
		var curve = this._curve.getValueWithoutFlow();
		var startParameter = this._startParameter.getValueWithoutFlow();
		var endParameter = this._endParameter.getValueWithoutFlow();
		curve.getPointOnCurve(Math.min(startParameter, endParameter), aReturnPoint);
	};
	
	staticFunctions.create = function(aCurve, aStartParameter, aEndParameter) {
		var newCurveDrawer2d = (new ClassReference()).init();
		
		newCurveDrawer2d.setPropertyInputWithoutNull("curve", aCurve);
		newCurveDrawer2d.setPropertyInputWithoutNull("startParameter", aStartParameter);
		newCurveDrawer2d.setPropertyInputWithoutNull("endParameter", aEndParameter);
		
		return newCurveDrawer2d;
	};
	
	staticFunctions._drawPoints1stDegree = function(aContext, aPointsArray) {
		var currentArray = aPointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) { //MENOTE: first point is skipped
			var endPoint = currentArray[i];
			aContext.lineTo(endPoint.x, endPoint.y);
		}
	};
	
	staticFunctions._drawPointsCompact2ndDegree = function(aContext, aPointsArray) {
		var currentArray = aPointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength;) { //MENOTE: first point is skipped, i is incremented inside the loop
			var anchorPoint1 = currentArray[i++];
			var endPoint = currentArray[i++];
			aContext.quadraticCurveTo(anchorPoint1.x, anchorPoint1.y, endPoint.x, endPoint.y);
		}
	};
	
	staticFunctions._drawPointsCompact3rdDegree = function(aContext, aPointsArray) {
		var currentArray = aPointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength;) { //MENOTE: first point is skipped, i is incremented inside the loop
			var anchorPoint1 = currentArray[i++];
			var anchorPoint2 = currentArray[i++];
			var endPoint = currentArray[i++];
			aContext.bezierCurveTo(anchorPoint1.x, anchorPoint1.y, anchorPoint2.x, anchorPoint2.y, endPoint.x, endPoint.y);
		}
	};
});