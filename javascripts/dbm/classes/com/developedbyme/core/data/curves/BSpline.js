dbm.registerClass("com.developedbyme.Global.DataObjects.Curves.BSpline3d", "com.developedbyme.Global.DataObjects.Curves.Curve3d", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d");


	
	var Curve3d = dbm.importClass("com.developedbyme.Global.DataObjects.Curves.Curve3d");
	var Point3d = dbm.importClass("com.developedbyme.Global.DataObjects.Points.Point3d");

	
		this._curveDegree;
		this.knotsArray;
		
		objectFunctions.init = function() {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d");
		}
		
		override General function construct() {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d.General::construct");
			super.General::construct();
			this.setType = "bSpline";
		}
		
		objectFunctions.isSetType = function(aType) {
			switch(aType) {
				case "bSpline":
				case "bSpline3d":
					return true;
				default:
					return this.superCall(aType);
			}
		}
		
		objectFunctions.setCurveDegree = function(aNr) {
			this._curveDegree = aNr;
		}
		
		objectFunctions.getCurveDegree = function() {
			return this._curveDegree;
		}
		
		objectFunctions.setupFromArrayWithUniformKnots = function(aValuesArray) {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d.setupFromArrayWithUniformKnots");
			
			this.setupFromArray(aValuesArray);
			var nrOfKnots = this.pointsArray.length+this._curveDegree+1;
			this.knotsArray = new Array(nrOfKnots);
			
			var startValue = this._curveDegree+1;
			var endValue = nrOfKnots-(this._curveDegree+1);
			for(var i = -1; ++i < startValue;) {
				this.knotsArray[i] = 0;
			}
			for(var i = startValue-1; ++i < endValue;) {
				this.knotsArray[i] = (i-(startValue-1))/(endValue-(startValue-1));
			}
			for(var i = endValue-1; ++i < nrOfKnots;) {
				this.knotsArray[i] = 1;
			}
		}
		
		objectFunctions.setupFromArrayWithKnots = function(aValuesArray, aKnotValuesArray) {
			
			//METODO: check so that there is a correct ratio between points and knots
			
			this.setupFromArray(aValuesArray);
			this.knotsArray = aKnotValuesArray;
		}
		
		Debug function realBezierBaseFunctionRecursive(aPointNr, aDegree, aParameter) {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d.Debug::realBezierBaseFunctionRecursive");
			//console.log(aPointNr, aDegree, aParameter, this.knotsArray.length);
			if(aDegree == 0) {
				//console.log("+++");
				if((this.knotsArray[aPointNr] <= aParameter) && (aParameter < this.knotsArray[aPointNr+1])) {
					return 1;
				}
				else {
					return 0;
				}
			}
			else {
				//console.log("---", this.knotsArray[aPointNr], this.knotsArray[aPointNr+aDegree], this.knotsArray[aPointNr+aDegree+1], this.knotsArray[aPointNr+1]);
				var returnValue = 0;
				var baseFunctionValue = this.Debug::realBezierBaseFunctionRecursive(aPointNr, aDegree-1, aParameter);
				if(baseFunctionValue != 0) {
					returnValue += (aParameter-this.knotsArray[aPointNr])/(this.knotsArray[aPointNr+aDegree]-this.knotsArray[aPointNr])*baseFunctionValue;
				}
				var baseFunctionValue = this.Debug::realBezierBaseFunctionRecursive(aPointNr+1, aDegree-1, aParameter);
				if(baseFunctionValue != 0) {
					returnValue += (this.knotsArray[aPointNr+aDegree+1]-aParameter)/(this.knotsArray[aPointNr+aDegree+1]-this.knotsArray[aPointNr+1])*baseFunctionValue;
				}
				//console.log(returnValue);
				//console.log("+++");
				return returnValue;
			}
		}
		
		Debug function realGetPointOnCurve(aParameter, aOutputPoint) {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d.Debug::realGetPointOnCurve");
			var xValue = 0;
			var yValue = 0;
			var zValue = 0;
			var currentArray = this.pointsArray;
			for (var i = -1; ++i < currentArray.length;) {
				var baseFunctionValue = this.Debug::realBezierBaseFunctionRecursive(i, this._curveDegree, aParameter);
				//console.log(">", i, baseFunctionValue, currentArray[i], currentArray[i].xValue, currentArray[i].yValue, currentArray[i].zValue);
				xValue += baseFunctionValue*currentArray[i].xValue;
				yValue += baseFunctionValue*currentArray[i].yValue;
				zValue += baseFunctionValue*currentArray[i].zValue;
			}
			aOutputPoint.xValue = xValue;
			aOutputPoint.yValue = yValue;
			aOutputPoint.zValue = zValue;
		}
		
		objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
			//console.log("com.developedbyme.Global.DataObjects.Curves.BSpline3d.getPointOnCurve");
			//METODO
			this.Debug::realGetPointOnCurve(aParameter, aOutputPoint);
		}
		
		objectFunctions.toString = function() {
			return "[com.developedbyme.Global.DataObjects.Curves.BSpline3d]";
		}
	});