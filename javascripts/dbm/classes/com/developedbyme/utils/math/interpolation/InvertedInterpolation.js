/**
 * Interpolataion for inverted
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
	
	var InvertedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.InvertedInterpolation");
		
		this.interpolationObject = null;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return 1-(this.interpolationObject.interpolate(1-aParameter));
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		return -1*(this.interpolationObject.getTangent(1-aParameter));
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aInterpolationObject) {
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.interpolationObject = aInterpolationObject;
		
		return newInterpolation;
	};
});