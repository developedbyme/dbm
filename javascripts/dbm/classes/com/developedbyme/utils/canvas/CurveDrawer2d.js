/**
 * A graphics in a 2d canvas.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.canvas.CurveDrawer2d", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	var CurveDrawer2d = dbm.importClass("com.developedbyme.utils.canvas.CurveDrawer2d");
	
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::init");
		
		this.superCall();
		
		this._startParameter = this.createProperty("startParameter", 0);
		this._endParameter = this.createProperty("endParameter", 0);
		this._curve = this.createProperty("curve", null);
		
		return this;
	};
	
	objectFunctions.draw = function(aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::draw");
		var curve = this._curve.getValue();
		var startParameter = this._startParameter.getValue();
		var endParameter = this._endParameter.getValue();
		
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
		newCurveDrawer2d.getProperty("curve").setValue(aCurve);
		return newCurveDrawer2d;
	};
	
	staticFunctions.drawCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aContext) {
		if(aCurve.isSetType("bezierCurve")) {
			ClassReference.drawBezierCurve(aCurve, aStartParameter, aEndParameter, aExactness, aContext);
		}
		else {
			//METODO: error message
		}
	};
	
	staticFunctions.drawBezierCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aContext) {
		//console.log("com.developedbyme.utils.canvas.CurveDrawer2d::drawBezierCurve (static)");
		var tempCurve = aCurve.createSameTypeOfCurve();
		dbm.singletons.dbmCurveEvaluator.getPartOfCurve(aCurve, aStartParameter, aEndParameter, aExactness, tempCurve);
		
		var currentArray = aCurve.pointsArray;
		var degree = aCurve.getCurveDegree();
		var maxParameter = aCurve.getMaxParameter();
		for(var i = degree; i <= maxParameter*degree; i += degree) {
			switch(degree) {
				case 1:
					//console.log("lineTo", currentArray[i].x, currentArray[i].y);
					aContext.lineTo(currentArray[i].x, currentArray[i].y);
					break;
				case 2:
					aContext.quadraticCurveTo(currentArray[i-1].x, currentArray[i-1].y, currentArray[i].x, currentArray[i].y);
					break;
				case 3:
					//console.log("lineTo", currentArray[i-2].x, currentArray[i-2].y, currentArray[i-1].x, currentArray[i-1].y, currentArray[i].x, currentArray[i].y);
					aContext.bezierCurveTo(currentArray[i-2].x, currentArray[i-2].y, currentArray[i-1].x, currentArray[i-1].y, currentArray[i].x, currentArray[i].y);
					break;
				default:
					//METODO: error message
			}
		}
		
		tempCurve.destroy();
	};
});