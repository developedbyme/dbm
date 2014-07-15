/**
 * Interpolataion for offseted interpolation
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.interpolation.OffsettedInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
	
	var OffsettedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
		
		this.interpolationObject = null;
		this.multiplier = 1;
		this.offset = 0;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return this.multiplier*this.interpolationObject.interpolate(aParameter)+this.offset;
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		return this.multiplier*this.interpolationObject.getTangent(aParameter);
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aInterpolationObject, aMultiplier, aOffset) {
		//console.log("com.developedbyme.utils.math.interpolation.OffsettedInterpolation::create");
		//console.log(aInterpolationObject, aMultiplier, aOffset);
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.interpolationObject = aInterpolationObject;
		newInterpolation.multiplier = VariableAliases.valueWithDefault(aMultiplier, 1);
		newInterpolation.offset = VariableAliases.valueWithDefault(aOffset, 0);
		
		return newInterpolation;
	};
});