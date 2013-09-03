dbm.registerClass("com.developedbyme.core.data.curves.BSpline", "com.developedbyme.core.data.curves.Curve", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.BSpline");
	
	var BSpline = dbm.importClass("com.developedbyme.core.data.curves.BSpline");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.curves.BSpline");
		
		this.setType = "bSpline";
		this._curveDegree = 0;
		this.knotsArray = null;
	};
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "bSpline":
				return true;
			default:
				return this.superCall(aType);
		}
	};
	
	objectFunctions.setCurveDegree = function(aNr) {
		this._curveDegree = aNr;
	};
	
	objectFunctions.getCurveDegree = function() {
		return this._curveDegree;
	};
	
	objectFunctions.setupFromArrayWithUniformKnots = function(aValuesArray) {
		//console.log("com.developedbyme.core.data.curves.BSpline.setupFromArrayWithUniformKnots");
		
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
	};
	
	objectFunctions.setupFromArrayWithKnots = function(aValuesArray, aKnotValuesArray) {
		
		//METODO: check so that there is a correct ratio between points and knots
		
		this.setupFromArray(aValuesArray);
		this.knotsArray = aKnotValuesArray;
	};
	
	objectFunctions._realBezierBaseFunctionRecursive = function(aPointNr, aDegree, aParameter) {
		//console.log("com.developedbyme.core.data.curves.BSpline.Debug::realBezierBaseFunctionRecursive");
		//console.log(aPointNr, aDegree, aParameter, this.knotsArray.length);
		if(aDegree === 0) {
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
			if(baseFunctionValue !== 0) {
				returnValue += (aParameter-this.knotsArray[aPointNr])/(this.knotsArray[aPointNr+aDegree]-this.knotsArray[aPointNr])*baseFunctionValue;
			}
			var baseFunctionValue = this._realBezierBaseFunctionRecursive(aPointNr+1, aDegree-1, aParameter);
			if(baseFunctionValue !== 0) {
				returnValue += (this.knotsArray[aPointNr+aDegree+1]-aParameter)/(this.knotsArray[aPointNr+aDegree+1]-this.knotsArray[aPointNr+1])*baseFunctionValue;
			}
			//console.log(returnValue);
			//console.log("+++");
			return returnValue;
		}
	};
	
	objectFunctions._realGetPointOnCurve = function(aParameter, aOutputPoint) {
		//console.log("com.developedbyme.core.data.curves.BSpline.Debug::realGetPointOnCurve");
		var x = 0;
		var y = 0;
		var z = 0;
		var currentArray = this.pointsArray;
		for (var i = 0; i < currentArray.length; i++) {
			var baseFunctionValue = this._realBezierBaseFunctionRecursive(i, this._curveDegree, aParameter);
			//console.log(">", i, baseFunctionValue, currentArray[i], currentArray[i].x, currentArray[i].y, currentArray[i].z);
			x += baseFunctionValue*currentArray[i].x;
			y += baseFunctionValue*currentArray[i].y;
			z += baseFunctionValue*currentArray[i].z;
		}
		aOutputPoint.x = x;
		aOutputPoint.y = y;
		aOutputPoint.z = z;
	};
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		//console.log("com.developedbyme.core.data.curves.BSpline.getPointOnCurve");
		//METODO
		this._realGetPointOnCurve(aParameter, aOutputPoint);
	};
	
	objectFunctions.createSameTypeOfCurve = function() {
		var newCurve = (new ClassReference()).init();
		newCurve.setType = this.setType();
		newCurve.setCurveDegree(this._curveDegree);
		return newCurve;
	};
});