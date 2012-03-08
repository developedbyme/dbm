dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart", "com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	
	var InterpolationTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart::_init");
		
		this.superCall();
		
		this.setValues(0, 1);
		this.interpolationObject = null;
				
		return this;
	};
	
	objectFunctions.setValues = function(aStartValue, aEndValue) {
		this.startValue = aStartValue;
		this.endValue = aEndValue;
		
		return this;
	};
	
	objectFunctions.setInterpolation = function(aInterpolationObject) {
		this.interpolationObject = aInterpolationObject;
		
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.InterpolationTimelinePart::getValueByParameter");
		
		var interpolatedParameter = this.interpolationObject.interpolate(aParameter);
		//console.log(aParameter, interpolatedParameter, this.startValue, this.endValue);
		return (1-interpolatedParameter)*this.startValue+(interpolatedParameter)*this.endValue;
	};
	
	objectFunctions.getTangentByParameter = function(aParameter) {
		return (this.endValue-this.startValue)*this.interpolationObject.getTangent(aParameter);
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "interpolationObject":
				return false;
		}
		return this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.interpolationObject = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStartValue, aEndValue, aInterpolationObject, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.setValues(aStartValue, aEndValue).setInterpolation(aInterpolationObject).setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});