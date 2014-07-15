/**
 * A graphics in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.canvas.CurveDrawer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::_init");
		
		this.superCall();
		
		this._startParameter = this.createProperty("startParameter", 0);
		this._endParameter = this.createProperty("endParameter", 0);
		this._curve = this.createProperty("curve", null).setAlwaysUpdateFlow(true);
		
		this._graphicsUpdate = this.addProperty("graphicsUpdate", AnyChangeMultipleInputProperty.create(this._objectProperty));
		this._graphicsUpdate.connectInput(this._startParameter);
		this._graphicsUpdate.connectInput(this._endParameter);
		this._graphicsUpdate.connectInput(this._curve);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::draw");
		var curve = this._curve.getValue();
		var startParameter = this._startParameter.getValue();
		var endParameter = this._endParameter.getValue();
		
		//console.log(this, curve, startParameter, endParameter, 0.01, aContext, aContext.strokeStyle);
		ClassReference.drawCurve(curve, startParameter, endParameter, 0.01, aContext);
	};
	
	objectFunctions.getStartPoint = function(aReturnPoint) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::getStartPoint");
		var curve = this._curve.getValue();
		var startParameter = this._startParameter.getValue();
		curve.getPointOnCurve(startParameter, aReturnPoint);
	};
	
	staticFunctions.create = function(aCurve) {
		var newCurveDrawer2d = (new ClassReference()).init();
		newCurveDrawer2d.setPropertyInput("curve", aCurve);
		return newCurveDrawer2d;
	};
	
	staticFunctions.drawCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::drawCurve (static)");
		if(aCurve.isSetType("bezierCurve")) {
			ClassReference.drawBezierCurve(aCurve, aStartParameter, aEndParameter, aExactness, aContext);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "drawCurve", "Curve is not of correect type.");
		}
	};
	
	staticFunctions.drawBezierCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::drawBezierCurve (static)");
		//console.log(aCurve, aStartParameter, aEndParameter, aExactness, aContext);
		
		var tempCurve = aCurve.createSameTypeOfCurve();
		dbm.singletons.dbmCurveEvaluator.getPartOfCurve(aCurve, aStartParameter, aEndParameter, aExactness, tempCurve);
		
		var currentArray = tempCurve.pointsArray;
		var degree = tempCurve.getCurveDegree();
		var maxParameter = tempCurve.getMaxParameter();
		for(var i = degree; i <= maxParameter*degree; i += degree) {
			switch(degree) {
				case 1:
					aContext.lineTo(currentArray[i].x, currentArray[i].y);
					break;
				case 2:
					aContext.quadraticCurveTo(currentArray[i-1].x, currentArray[i-1].y, currentArray[i].x, currentArray[i].y);
					break;
				case 3:
					aContext.bezierCurveTo(currentArray[i-2].x, currentArray[i-2].y, currentArray[i-1].x, currentArray[i-1].y, currentArray[i].x, currentArray[i].y);
					break;
				default:
					ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "drawBezierCurve", "Can't draw bezier curve of degree " + degree + ".");
					break;
			}
		}
		
		//dbm.singletons.dbmCurveEvaluator.recycleCurve(tempCurve);
		
		tempCurve.destroy();
	};
});