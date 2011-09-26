dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator", "com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");


	
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
	var LineDrawerPoint = dbm.importClass("com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint");
	var RecyclerGroup = dbm.importClass("com.developedbyme.Global.GlobalObjectParts.DataRecycler.RecyclerGroup");
	
	
		
		objectFunctions.init = function() {
			//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator")
			
			dbm.singletons.dbmCurveEvaluator.addEvaluator(this);
		}
		
		objectFunctions.canEvaluate = function(aPointSet, aType, aForward) {
			if(!aPointSet.isSetType("bezierCurve")) return false;
			var theCurve = com.developedbyme.Global.DataObjects.Curves.BezierCurveInterface(aPointSet);
			switch(aType) {
				case "cv":
					return true;
				case "evenSpacingByParameter":
				case "exact":
					//METODO: check that it is bezier curve
					return true;
			}
			return false;
		}
		
		objectFunctions.getEvaluationFunction = function(aPointSet, aType, aForward) {
			var theCurve = com.developedbyme.Global.DataObjects.Curves.BezierCurveInterface(aPointSet);
			switch(aType) {
				case "cv":
					if(aForward) {
						//return evaluate_cv;
					}
					return null; //evaluate_cv_backwards; //MEDEBUG: //
				case "evenSpacingByParameter":
					if(aForward) {
						return (theCurve.isCompact() ? evaluate_evenSpacingByParameter : evaluate_evenSpacingByParameter_multipleLineDrawer);
					}
					return null; //evaluate_evenSpacingByParameter_backwards; //MEDEBUG: //
				case "exact":
					if(aForward) {
						//MEDEBUG: casting to object
						if(Object(aPointSet).getCurveDegree() == 2) {
							return (theCurve.isCompact() ? evaluate_exact2ndDegree : evaluate_exact2ndDegree_multipleLineDrawer);
						}
						return null; //MEDEBUG
					}
					return null; //evaluate_evenSpacingByParameter_backwards; //MEDEBUG: //
			}
			return null;
		}
		
		objectFunctions.toString = function() {
			return "[com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator]";
		}
		
		staticFunctions.evaluateSegement_cv = function(aPointSet, aSegmentPointsArray, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aPartTypeNr, aLineDrawer) {
			var nrOfSegments = aNrOfSegments;
			var i = -1;
			switch(aPartTypeNr) {
				case 0:
					//METODO
					break;
				case 1:
					i = 0;
					break;
				case 2:
					//METODO
					i = 0;
					break;
				case 3:
					//METODO
					break;
			}
			var recyclerGroup = GlobalLink::globalObjects["dataRecycler"].getRecyclerGroup(com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint);
			for(; ++i < aSegmentPointsArray.length;) {
				var newPoint = recyclerGroup.getObject();
				newPoint.x = aSegmentPointsArray[i].xValue;
				newPoint.y = aSegmentPointsArray[i].yValue;
				aLineDrawer.addPoint(newPoint);
			}
		}
		
		staticFunctions.evaluateSegment_evenSpacingByParameter = function(aPointSet, aSegmentPointsArray, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aPartTypeNr, aLineDrawer) {
			//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator.evaluateSegment_evenSpacingByParameter");
			//console.log(aPointSet);
			//console.log(aSegmentPointsArray);
			
			var nrOfSegments = aNrOfSegments;
			var i = -1;
			switch(aPartTypeNr) {
				case 0:
					//METODO: recount segments
					break;
				case 1:
					i = 0;
					break;
				case 2:
					//METODO: recount segments
					i = 0;
					break;
				case 3:
					//METODO: recount segments
					break;
			}
			var recyclerGroup = GlobalLink::globalObjects["dataRecycler"].getRecyclerGroup(com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint);
			var curveEvaluator = dbm.singletons.dbmCurveEvaluator;
			if(aPointSet.nrOfDimensions == 3) {
				var tempPoint3d = (new Point3d()).init();
				for(; ++i < nrOfSegments;) {
					curveEvaluator.getPointOnBezierSegment3d(aSegmentPointsArray, (i/(nrOfSegments-1))*(aEndParameter-aStartParameter)+aStartParameter, tempPoint3d);
					var newPoint = recyclerGroup.getObject();
					newPoint.x = tempPoint3d.xValue;
					newPoint.y = tempPoint3d.yValue;
					aLineDrawer.addPoint(newPoint);
				}
			}
			else if(aPointSet.nrOfDimensions == 2) {
				var tempPoint2d = (new Point2d()).init();
				for(; ++i < nrOfSegments;) {
					curveEvaluator.getPointOnBezierSegment2d(aSegmentPointsArray, (i/(nrOfSegments-1))*(aEndParameter-aStartParameter)+aStartParameter, tempPoint2d);
					var newPoint = recyclerGroup.getObject();
					newPoint.x = tempPoint2d.xValue;
					newPoint.y = tempPoint2d.yValue;
					aLineDrawer.addPoint(newPoint);
				}
			}
			else {
				//METODO: error message
			}
		}
		
		staticFunctions.evaluateSegment_exact2ndDegree = function(aPointSet, aSegmentPointsArray, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aPartTypeNr, aLineDrawer) {
			//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator.evaluateSegment_exact2ndDegree");
			
			var tempPoint = (new Point3d()).init();
			var nrOfSegments = aNrOfSegments;
			var i = -1;
			switch(aPartTypeNr) {
				case 0:
					//METODO
					break;
				case 1:
					i = 0;
					break;
				case 2:
					//METODO
					i = 0;
					break;
				case 3:
					//METODO
					break;
			}
			var recyclerGroup = GlobalLink::globalObjects["dataRecycler"].getRecyclerGroup(com.developedbyme.Global.Utilities.LineDrawer.LineDrawerPoint);
			for(; ++i < 3;) {
				var newPoint = recyclerGroup.getObject();
				newPoint.x = aSegmentPointsArray[i].xValue;
				newPoint.y = aSegmentPointsArray[i].yValue;
				aLineDrawer.addPoint(newPoint);
			}
		}
		
		staticFunctions.evaluateSegments = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aEvaluationFunction, aLineDrawer) {
			
			//MEDEBUG: casting to object, use bezier curve interface instead of compact bezier curve
			var segmentPointsArray = new Array(aCurve.getCurveDegree()+1);
			
			var segmentStart = uint(Math.floor(aStartParameter));
			var segmentEnd = uint(Math.floor(aEndParameter));
			if((segmentEnd == aEndParameter) && (segmentStart != segmentEnd)) {
				segmentEnd--;
			}
			if(segmentStart == segmentEnd) {
				aCurve.InternalFunctionality::getSegmentArray(segmentStart, segmentPointsArray);
				aEvaluationFunction(aCurve, segmentPointsArray, aStartParameter-segmentStart, aEndParameter-segmentEnd, aNrOfSegments, aExactness, 3, aLineDrawer);
			}
			else {
				aCurve.InternalFunctionality::getSegmentArray(segmentStart, segmentPointsArray);
				aEvaluationFunction(aCurve, segmentPointsArray, aStartParameter-segmentStart, 1, aNrOfSegments, aExactness, 0, aLineDrawer);
				for(var i = segmentStart; ++i < segmentEnd;) {
					aCurve.InternalFunctionality::getSegmentArray(i, segmentPointsArray);
					aEvaluationFunction(aCurve, segmentPointsArray, 0, 1, aNrOfSegments, aExactness, 1, aLineDrawer);
				}
				aCurve.InternalFunctionality::getSegmentArray(segmentEnd, segmentPointsArray);
				aEvaluationFunction(aCurve, segmentPointsArray, 0, aEndParameter-segmentEnd, aNrOfSegments, aExactness, 2, aLineDrawer);
			}
		}
		
		staticFunctions.evaluateSegments_multipleLineDrawer = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aEvaluationFunction, aLineDrawer) {
			
			//MEDEBUG: casting to object, use bezier curve interface instead of compact bezier curve
			var segmentPointsArray = new Array(aCurve.getCurveDegree()+1);
			
			var segmentStart = uint(Math.floor(aStartParameter));
			var segmentEnd = uint(Math.floor(aEndParameter));
			if((segmentEnd == aEndParameter) && (segmentStart != segmentEnd)) {
				segmentEnd--;
			}
			if(segmentStart == segmentEnd) {
				aCurve.InternalFunctionality::getSegmentArray(segmentStart, segmentPointsArray);
				var currentLineDrawer = aLineDrawer.Runtime::createLineDrawer();
				aEvaluationFunction(aCurve, segmentPointsArray, aStartParameter-segmentStart, aEndParameter-segmentEnd, aNrOfSegments, aExactness, 4, currentLineDrawer);
			}
			else {
				aCurve.InternalFunctionality::getSegmentArray(segmentStart, segmentPointsArray);
				var currentLineDrawer = aLineDrawer.Runtime::createLineDrawer();
				aEvaluationFunction(aCurve, segmentPointsArray, aStartParameter-segmentStart, 1, aNrOfSegments, aExactness, 4, currentLineDrawer);
				for(var i = segmentStart; ++i < segmentEnd;) {
					aCurve.InternalFunctionality::getSegmentArray(i, segmentPointsArray);
					var currentLineDrawer = aLineDrawer.Runtime::createLineDrawer();
					aEvaluationFunction(aCurve, segmentPointsArray, 0, 1, aNrOfSegments, aExactness, 4, currentLineDrawer);
				}
				aCurve.InternalFunctionality::getSegmentArray(segmentEnd, segmentPointsArray);
				var currentLineDrawer = aLineDrawer.Runtime::createLineDrawer();
				aEvaluationFunction(aCurve, segmentPointsArray, 0, aEndParameter-segmentEnd, aNrOfSegments, aExactness, 4, currentLineDrawer);
			}
		}
		
		staticFunctions.evaluate_evenSpacingByParameter = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
			
			var returnLineDrawer;
			if(aLineDrawer != null) {
				returnLineDrawer = com.developedbyme.Global.Utilities.LineDrawer.LineDrawer(aLineDrawer);
				returnLineDrawer.resetLineDrawer();
			}
			else {
				returnLineDrawer = (new LineDrawer()).init();
			}
			returnLineDrawer.setLineDirection(true);
			var evaluationFunction = evaluateSegment_evenSpacingByParameter;
			
			evaluateSegments(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, evaluationFunction, returnLineDrawer);
			
			return returnLineDrawer;
		}
		
		staticFunctions.evaluate_exact2ndDegree = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
			
			var returnLineDrawer;
			if(aLineDrawer != null) {
				returnLineDrawer = com.developedbyme.Global.Utilities.LineDrawer.CurveDrawer(aLineDrawer);
				returnLineDrawer.resetLineDrawer();
			}
			else {
				returnLineDrawer = (new CurveDrawer()).init();
			}
			returnLineDrawer.setLineDirection(true);
			var evaluationFunction = evaluateSegment_exact2ndDegree;
			
			evaluateSegments(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, evaluationFunction, returnLineDrawer);
			
			return returnLineDrawer;
		}
		
		staticFunctions.evaluate_evenSpacingByParameter_multipleLineDrawer = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
			
			var returnLineDrawer;
			if(aLineDrawer != null) {
				returnLineDrawer = com.developedbyme.Global.Utilities.LineDrawer.MultipleLineDrawer(aLineDrawer);
				returnLineDrawer.resetLineDrawer();
			}
			else {
				returnLineDrawer = (new MultipleLineDrawer()).init();
			}
			returnLineDrawer.Runtime::createLineDrawer = function() {
				var newLineDrawer = GlobalLink::globalObjects["dataRecycler"].getObject(com.developedbyme.Global.Utilities.LineDrawer.LineDrawer);
				this.addLineDrawer(newLineDrawer);
				newLineDrawer.setLineDirection(this.InternalFunctionality::lineDirectionForward);
				return newLineDrawer;
			}
			returnLineDrawer.setLineDirection(true);
			var evaluationFunction = evaluateSegment_evenSpacingByParameter;
			
			evaluateSegments_multipleLineDrawer(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, evaluationFunction, returnLineDrawer);
			
			return returnLineDrawer;
		}
		
		staticFunctions.evaluate_exact2ndDegree_multipleLineDrawer = function(aCurve, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
			
			var returnLineDrawer;
			if(aLineDrawer != null) {
				returnLineDrawer = com.developedbyme.Global.Utilities.LineDrawer.MultipleLineDrawer(aLineDrawer);
				returnLineDrawer.resetLineDrawer();
			}
			else {
				returnLineDrawer = (new MultipleLineDrawer()).init();
			}
			returnLineDrawer.Runtime::createLineDrawer = function() {
				var newLineDrawer = GlobalLink::globalObjects["dataRecycler"].getObject(com.developedbyme.Global.Utilities.LineDrawer.CurveDrawer);
				this.addLineDrawer(newLineDrawer);
				newLineDrawer.setLineDirection(this.InternalFunctionality::lineDirectionForward);
				return newLineDrawer;
			}
			returnLineDrawer.setLineDirection(true);
			var evaluationFunction = evaluateSegment_exact2ndDegree;
			
			evaluateSegments_multipleLineDrawer(aCurve, aStartParameter, aEndParameter, aNrOfSegments, aExactness, evaluationFunction, returnLineDrawer);
			
			return returnLineDrawer;
		}
	});