/**
 * Interpolataion for sine
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.interpolation.SineInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.SineInterpolation");
	
	var SineInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.SineInterpolation");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
		
	/**
	 * Constructor.
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.SineInterpolation");
		
		this.minValue = 0;
		this.maxValue = 0.5*Math.PI;
		this.offset = 0;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		
		var sineParameter = (this.maxValue-this.minValue)*aParameter+this.minValue+this.offset;
		
		return Math.sin(sineParameter);
	};
	
	/**
	 * Gets the tangent for a parameter
	 */
	objectFunctions.getTangent = function(aParameter) {
		
		var sineParameter = (this.maxValue-this.minValue)*aParameter+this.minValue+this.offset;
		
		return Math.cos(sineParameter);
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aMinValue, aMaxValue, aOffset) {
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.minValue = VariableAliases.valueWithDefault(aMinValue, 0);
		newInterpolation.maxValue = VariableAliases.valueWithDefault(aMaxValue, 0.5*Math.PI);
		newInterpolation.offset = VariableAliases.valueWithDefault(aOffset, 0);
		
		return newInterpolation;
	};
});