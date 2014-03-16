/**
 * Interpolataion for repeated range
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.interpolation.RepeatedRangeInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.RepeatedRangeInterpolation");
	
	var RepeatedRangeInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.RepeatedRangeInterpolation");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.RepeatedRangeInterpolation");
		
		this.interpolationObject = null;
		this.minValue = 0;
		this.maxValue = 1;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		
		var range = (this.maxValue-this.minValue);
		
		var localParameter = (this.interpolationObject.interpolate(aParameter)-this.minValue)/range;
		localParameter -= Math.floor(localParameter);
		
		return this.minValue+localParameter*range;
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aInterpolationObject, aMinValue, aMaxValue) {
		//console.log("com.developedbyme.utils.math.interpolation.RepeatedRangeInterpolation::create");
		//console.log(aInterpolationObject, aMinValue, aMaxValue);
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.interpolationObject = aInterpolationObject;
		newInterpolation.minValue = VariableAliases.valueWithDefault(aMinValue, 0);
		newInterpolation.maxValue = VariableAliases.valueWithDefault(aMaxValue, 1);
		
		return newInterpolation;
	};
});