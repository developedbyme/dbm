/**
 * Interpolataion for step
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.interpolation.StepInterpolation", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.interpolation.StepInterpolation");
	
	var StepInterpolation = dbm.importClass("dbm.utils.math.interpolation.StepInterpolation");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.math.interpolation.StepInterpolation");
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return (aParameter >= 1) ? 1 : 0;
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		return (aParameter === 1) ? Infinity : 0;
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function() {
		var newInterpolation = (new ClassReference()).init();
		
		return newInterpolation;
	};
});