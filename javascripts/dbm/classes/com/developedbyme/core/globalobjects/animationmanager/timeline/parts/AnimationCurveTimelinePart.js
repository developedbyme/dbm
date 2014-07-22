/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart", "com.developedbyme.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	//Self reference
	var AnimationCurveTimelinePart = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var ExtrapolationTypes = dbm.importClass("com.developedbyme.constants.ExtrapolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart::_init");
		
		this.superCall();
		
		this.curve = null;
		this.preInfinityMethod = ExtrapolationTypes.CONSTANT;
		this.postInfinityMethod = ExtrapolationTypes.CONSTANT;
		this.exactness = 0.01;
		this.startParameter = 0;
		this.endParameter = 1;
				
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
		
		return dbm.singletons.dbmCurveEvaluator.getValueOfAnimationCurve(this.curve, (aParameter-this.startParameter)/(this.endParameter-this.startParameter), this.preInfinityMethod, this.postInfinityMethod, this.exactness);
		
	};
	
	//METODO: add tangent function
	
	staticFunctions.create = function(aCurve, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.curve = aCurve;
		newPart.setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});