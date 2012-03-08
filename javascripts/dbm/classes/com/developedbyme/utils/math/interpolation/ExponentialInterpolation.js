/**
 * Interpolataion for exponetial
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.interpolation.ExponentialInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
	
	var ExponentialInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.ExponentialInterpolation");
		
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