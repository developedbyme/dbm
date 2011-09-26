dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart", "com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	var AnimationCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	var ExtrapolationTypes = dbm.importClass("com.developedbyme.constants.ExtrapolationTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart::init");
		
		this.superCall();
		
		this.curve = null;
		this.preInfinityMethod = ExtrapolationTypes.CONSTANT;
		this.postInfinityMethod = ExtrapolationTypes.CONSTANT;
		this.exactness = 0.01;
				
		return this;
	};
	
	objectFunctions.setCurve = function(aCurve, aPreInfinityMethod, aPostInfinityMethod, aExactness) {
		
		this.curve = aCurve;
		this.preInfinityMethod = aPreInfinityMethod;
		this.postInfinityMethod = aPostInfinityMethod;
		this.exactness = aExactness;
		
		return this;
	};
	
	objectFunctions.getValueByParameter = function(aParameter) {
		
		return dbm.singletons.dbmCurveEvaluator.getValueOfAnimationCurve(this.curve, aParameter, this.preInfinityMethod, this.postInfinityMethod, this.exactness);
		
	};
	
	staticFunctions.create = function(aCurve, aPreInfinityMethod, aPostInfinityMethod, aExactness, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		aPreInfinityMethod = VariableAliases.valueWithDefault(aPreInfinityMethod, ExtrapolationTypes.CONSTANT);
		aPostInfinityMethod = VariableAliases.valueWithDefault(aPostInfinityMethod, ExtrapolationTypes.CONSTANT);
		aExactness = VariableAliases.valueWithDefault(aExactness, 0.01);
		
		newPart.setCurve(aCurve, aPreInfinityMethod, aPostInfinityMethod, aExactness).setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});