/**
 * Static class for calculating gauss distributions.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.GaussDistribution", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.GaussDistribution");
	
	/**
	 * Returns the value for a point on gauss distribution curve.
	 *
	 * @param	aX					The position on the curve.
	 * @param	aAverage			The point where the average of the curve is located.
	 * @param	aStandardDeviation	The standard deviation.
	 * @return	The gauss value.
	 */
	staticFunctions.getGaussDistributionValue = function(aX, aAverage, aStandardDeviation) {
		if(aAverage === undefined) {
			aAverage = 0;
		}
		if(aAverage === aStandardDeviation) {
			aStandardDeviation = 1;
		}
		return Math.pow(Math.E, (-0.5*Math.pow(aX-aAverage, 2)/(Math.pow(aStandardDeviation, 2))));
	}
	
	/**
	 * Returns the value for a point on gauss distribution curve. The value is normalized so that the total of the gauss curve always sums to 1.
	 *
	 * @param	aX					The position on the curve.
	 * @param	aAverage			The point where the average of the curve is located.
	 * @param	aStandardDeviation	The standard deviation.
	 * @return	The gauss value.
	 */
	staticFunctions.getNormalGaussDistributionValue = function(aX, aAverage, aStandardDeviation) {
		if(aAverage === undefined) {
			aAverage = 0;
		}
		if(aAverage === aStandardDeviation) {
			aStandardDeviation = 1;
		}
		return (1/(aStandardDeviation*Math.sqrt(2*Math.PI)))*getGaussDistributionValue(aX, aAverage, aStandardDeviation);
	}
	
	/**
	 * Gets the standard deviation for a curve a specified length.
	 *
	 * @param	aLength		The length of the curve.
	 * @param	aZeroValue	Since 0 can't be reached before infinity. The zero value must be set to bigger than 0.
	 * @return	The standard deviation.
	 */
	staticFunctions.getStandardDeviationForLength = function(aLength, aZeroValue) {
		//console.log("getStandardDeviationForLength");
		if(aZeroValue === undefined) {
			aZeroValue = 0.01;
		}
		return Math.sqrt(-0.5*(Math.pow(aLength, 2)/Math.log(aZeroValue)));
	}
});