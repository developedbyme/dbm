/**
 * Interpolataion for offseted interpolation
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.interpolation.OffsettedInterpolation", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
	
	var OffsettedInterpolation = dbm.importClass("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
		
	/**
	 * Constructor.
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.math.interpolation.OffsettedInterpolation");
		
		this.interpolationObject;
		this.multipler = 1;
		this.offset = 0;
		
		return this;
	};
	
	/**
	 * Interpolates
	 */
	objectFunctions.interpolate = function(aParameter) {
		return this.multipler*this.interpolationObject.interpolate(aParameter)+this.offset;
	};
	
	/**
	 * Create a new interpolation
	 */
	staticFunctions.create = function(aInterpolationObject, aMultiplier, aOffset) {
		var newInterpolation = (new ClassReference()).init();
		
		newInterpolation.interpolationObject = aInterpolationObject;
		newInterpolation.multiplier = VariableAliases.valueWithDefault(aMultiplier, 1);
		newInterpolation.offset = VariableAliases.valueWithDefault(aOffset, 0);
		
		return newInterpolation;
	};
});