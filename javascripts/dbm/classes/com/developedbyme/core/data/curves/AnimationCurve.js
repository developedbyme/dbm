dbm.registerClass("com.developedbyme.core.data.curves.AnimationCurve", "com.developedbyme.core.data.curves.BezierCurve", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.curves.AnimationCurve");

	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.curves.AnimationCurve");
		
		this.superCall();
		
		this.setType = "animationCurve";
		this._curveDegree = 3;
		
		return this;
	};
	
	objectFunctions.isSetType = function(aType) {
		switch(aType) {
			case "animationCurve":
				return true;
			default:
				return this.superCall(aType);
		}
	};
});