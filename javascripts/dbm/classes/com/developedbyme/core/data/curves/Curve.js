dbm.registerClass("com.developedbyme.core.data.curves.Curve", "com.developedbyme.core.data.points.PointSet", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.Curve");

	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.curves.Curve");
		
		this.superCall();
		
		return this;
	}
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "curve":
				return true;
			default:
				return this.superCall(aType);
		}
	}
	
	objectFunctions.getPointOnCurve = function(aParameter, aOutputPoint) {
		//MENOTE: must be overwritten
		//METODO: error message
	}
	
	objectFunctions.getTangentOnCurve = function(aParameter, aOutputPoint) {
		//MENOTE: must be overwritten
		//METODO: error message
	}
	
	objectFunctions.getNormalOnCurve = function(aParameter, aOutputPoint) {
		//MENOTE: must be overwritten
		//METODO: error message
	}
	
	staticFunctions.createWithLength = function(aNumberOfDimensions, aLength) {
		var newSet = (new ClassReference()).init();
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
	
	staticFunctions.createWithValues = function(aNumberOfDimensions, aValues) {
		var newSet = (new ClassReference()).init();
		newSet.setupFromArray(aValues);
		return newSet;
	};
});