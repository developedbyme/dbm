/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart", "dbm.core.globalobjects.animationmanager.timeline.parts.TimelinePartBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	//Self reference
	var AnimationCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var ExtrapolationTypes = dbm.importClass("dbm.constants.ExtrapolationTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart::_init");
		
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
		//console.log("dbm.core.globalobjects.animationmanager.timeline.parts.AnimationCurveTimelinePart::getValueByParameter");
		
		var parameter = (aParameter-this.startParameter)/(this.endParameter-this.startParameter); //METODO: this doesn't seem to be the correct calculation
		//console.log(parameter, this.curve);
		
		return dbm.singletons.dbmCurveEvaluator.getValueOfAnimationCurve(this.curve, parameter, this.preInfinityMethod, this.postInfinityMethod, this.exactness);
		
	};
	
	//METODO: add tangent function
	
	staticFunctions.create = function(aCurve, aStartTime, aLength) {
		var newPart = (new ClassReference()).init();
		
		newPart.curve = aCurve;
		newPart.setTimes(aStartTime, aStartTime+aLength);
		
		return newPart;
	};
});