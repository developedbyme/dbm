dbm.runTempFunction(function() {
	
	var CurveEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.CurveEvaluator");
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	var startFunction = function() {
		console.log("startFunction");
		
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(3));
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(2));
		console.log(CurveEvaluator.getInstance().getBezierMultipliersArray(4));
		
		var pointSet = PointSet.createWithLength(2, 4);
		console.log(pointSet);
		
		var pointSet = PointSet.createWithValues(2, [0, 0, 50, 0, 50, 50, 0, 50]);
		console.log(pointSet);
		
		var roundedCurve = BezierCurve.createWithLength(2, 3, 4*4);
		CurveEvaluator.getInstance().createMultiSegmentBezierCurveFromPoints2d(pointSet.pointsArray, roundedCurve, true);
		console.log(roundedCurve);
		
		var fullCurve = BezierCurve.createWithLength(2, 3, 4);
		CurveEvaluator.getInstance().createBezierCurveFromPoints2d(pointSet.pointsArray, fullCurve, [0, 0.333, 0.667, 1]);
		console.log(fullCurve);
	};
	
	dbm.addStartFunction(startFunction);
});