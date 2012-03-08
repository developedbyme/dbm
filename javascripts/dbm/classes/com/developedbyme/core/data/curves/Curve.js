dbm.registerClass("com.developedbyme.core.data.curves.Curve", "com.developedbyme.core.data.points.PointSet", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.Curve");
	//"use strict";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.curves.Curve::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "curve":
				return true;
			default:
				return this.superCall(aType);
		}
	};
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		//console.log("com.developedbyme.core.data.curves.Curve::getPointOnCurve");
		//MENOTE: must be overwritten
		//METODO: error message
	};
	
	objectFunctions.getTangentOnCurve = function(aParameter, aOutputPoint) {
		//MENOTE: must be overwritten
		//METODO: error message
	};
	
	objectFunctions.getNormalOnCurve = function(aParameter, aOutputPoint) {
		//MENOTE: must be overwritten
		//METODO: error message
	};
	
	objectFunctions.createSameTypeOfCurve = function() {
		var newCurve = (new ClassReference()).init();
		return newCurve;
	};
	
	objectFunctions.duplicate = function() {
		var theObject = this.createSameTypeOfCurve();
		var currentArray = this.pointsArray;
		var outputArray = theObject.pointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			outputArray.push(currentArray[i].duplicate());
		}
		return theObject;
	};
	
	staticFunctions.createWithLength = function(aLength) {
		var newSet = (new ClassReference()).init();
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
	
	staticFunctions.createWithValues = function(aValues, aNumberOfDimensions) {
		var newSet = (new ClassReference()).init();
		newSet.setupFromArray(aValues, aNumberOfDimensions);
		return newSet;
	};
});