/**
 * Interpolataion for linear
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.math.interpolation.LinearInterpolation", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.interpolation.LinearInterpolation");
	
	var LinearInterpolation = dbm.importClass("dbm.utils.math.interpolation.LinearInterpolation");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.math.interpolation.LinearInterpolation");
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return aParameter;
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		return 1;
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function() {
		var newInterpolation = (new ClassReference()).init();
		
		return newInterpolation;
	};
});