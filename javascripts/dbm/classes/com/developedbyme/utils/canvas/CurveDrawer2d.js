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
		var curve = this._curve.getValue();
		var startParameter = this._startParameter.getValue();
		var endParameter = this._endParameter.getValue();
		
	};
	
	objectFunctions.getStartPoint = function(aReturnPoint) {
		var curve = this._curve.getValue();
		var startParameter = this._startParameter.getValue();
		curve.getPointOnCurve(startParameter, aReturnPoint);
	};
	
	staticFunctions.create = function() {
		var newCurveDrawer2d = (new ClassReference()).init();
		
		return newCurveDrawer2d;
	};
	
	staticFunctions.drawCurve = function(aCurve, aStartParameter, aEndParameter, aContext) {
		var tempCurve = aCurve.createSameTypeOfCurve();
	};
});