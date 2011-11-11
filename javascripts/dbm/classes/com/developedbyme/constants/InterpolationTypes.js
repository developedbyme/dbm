dbm.registerClass("com.developedbyme.constants.InterpolationTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.InterpolationTypes");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	staticFunctions.STEP = "step";
	staticFunctions.LINEAR = "linear";
	staticFunctions.QUADRIC = "quadric";
	staticFunctions.CUBIC = "cubic";
	staticFunctions.INVERTED_QUADRIC = "inverted/quadric";
	staticFunctions.INVERTED_CUBIC = "inverted/cubic";
	
	staticFunctions.SINE = "sine";
	staticFunctions.INVERTED_SINE = "inverted/sine";
	staticFunctions.NORMALIZED_COSINE = "normalizedCosine";
	
	staticFunctions.DYNAMIC_EXPONENTIAL = "exponential";
	staticFunctions.DYNAMIC_INVERTED = "inverted";
	
});