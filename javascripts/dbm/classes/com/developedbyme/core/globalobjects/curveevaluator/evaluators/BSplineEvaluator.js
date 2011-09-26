dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator", "com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator");


	
	var BaseObject = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject");
	var PointSet = dbm.importClass("com.developedbyme.core.data.points.PointSet");
	var Point2d = dbm.importClass("com.developedbyme.core.data.points.Point");
	var Point3d = dbm.importClass("com.developedbyme.Global.DataObjects.Points.Point3d");
	var CompactBezierCurve3d = dbm.importClass("com.developedbyme.core.data.curves.CompactBezierCurve");
	var BezierCurveInterface = dbm.importClass("com.developedbyme.Global.DataObjects.Curves.BezierCurveInterface");
	var CurveEvaluator = dbm.importClass("com.developedbyme.Global.GlobalObjects.CurveEvaluator");
	var LineDrawerInterface = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.LineDrawerInterface");
	var LineDrawer = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.LineDrawer");
	var CurveDrawer = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.CurveDrawer");
	var DrawBaseObject = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.DrawBaseObject");
	var MultipleLineDrawer = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.MultipleLineDrawer");
	var BSpline3d = dbm.importClass("com.developedbyme.Global.DataObjects.Curves.BSpline3d");
	var RecyclerGroup = dbm.importClass("com.developedbyme.Global.GlobalObjectParts.DataRecycler.RecyclerGroup");
	var LineDrawerPoint = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint");
	
	
		
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator")
		
		dbm.singletons.dbmCurveEvaluator.addEvaluator(this);
	}
	
	objectFunctions.canEvaluate = function(aPointSet, aType, aForward) {
		if(!aPointSet.isSetType("bSpline")) return false;
		switch(aType) {
			case "evenSpacingByParameter":
				return true;
		}
		return false;
	}
	
	objectFunctions.getEvaluationFunction = function(aPointSet, aType, aForward) {
		switch(aType) {
			case "evenSpacingByParameter":
				if(aForward) {
					return evaluate_evenSpacingByParameter;
				}
				return null; //evaluate_evenSpacingByParameter_backwards; //MEDEBUG: //
		}
		return null;
	}
	
	staticFunctions.evaluate_evenSpacingByParameter = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BSplineEvaluator.evaluate_evenSpacingByParameter");
		var returnLineDrawer ;
		if(aLineDrawer != null) {
			returnLineDrawer = com.developedbyme.Global.Utilities.LineDrawer.LineDrawer(aLineDrawer);
			returnLineDrawer.resetLineDrawer();
		}
		else {
			returnLineDrawer = (new LineDrawer()).init();
		}
		
		returnLineDrawer.setLineDirection(true);
		var theCurve = com.developedbyme.Global.DataObjects.Curves.BSpline3d(aCurve);
		var tempPoint = (new Point3d()).init();
		var recyclerGroup = GlobalLink::globalObjects["dataRecycler"].getRecyclerGroup(com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint);
		for(var i = -1; ++i < aNrOfSegments+1;) {
			theCurve.getPointOnCurve((i/aNrOfSegments)*(aEndParameter-aStartParameter)+aStartParameter, tempPoint);
			//console.log((i/aNrOfSegments)*(aEndParameter-aStartParameter)+aStartParameter, tempPoint.xValue, tempPoint.yValue);
			var newPoint = recyclerGroup.getObject();
			newPoint.x = tempPoint.xValue;
			newPoint.y = tempPoint.yValue;
			returnLineDrawer.addPoint(newPoint);
		}
		
		return returnLineDrawer;
	}
});