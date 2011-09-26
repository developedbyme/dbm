dbm.registerClass("com.developedbyme.constants.InterpolationTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.InterpolationTypes");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	staticFunctions.LINEAR = "linear";
	staticFunctions.QUADRIC = "quadric";
	staticFunctions.CUBIC = "cubic";
	staticFunctions.INVERTED_QUADRIC = "invertedQuadric";
	staticFunctions.INVERTED_CUBIC = "invertedCubic";
	
	staticFunctions.DYNAMIC_EXPONENTIAL = "exponential";
	
});