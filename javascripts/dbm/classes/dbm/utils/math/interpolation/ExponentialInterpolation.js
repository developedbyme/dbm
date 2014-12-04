/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Interpolataion for exponetial.
 */
dbm.registerClass("dbm.utils.math.interpolation.ExponentialInterpolation", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.math.interpolation.ExponentialInterpolation");
	
	var ExponentialInterpolation = dbm.importClass("dbm.utils.math.interpolation.ExponentialInterpolation");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.math.interpolation.ExponentialInterpolation");
		
		this.exponent = 1;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return Math.pow(aParameter, this.exponent);
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		return this.exponent*aParameter;
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aExponent) {
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.exponent = aExponent;
		
		return newInterpolation;
	};
});