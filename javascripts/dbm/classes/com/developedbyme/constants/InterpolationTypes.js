/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.InterpolationTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.InterpolationTypes");
	//"use strict";
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	staticFunctions.STEP = "step";
	staticFunctions.LINEAR = "linear";
	staticFunctions.QUADRATIC = "quadratic";
	staticFunctions.CUBIC = "cubic";
	staticFunctions.INVERTED_QUADRATIC = "inverted/quadratic";
	staticFunctions.INVERTED_CUBIC = "inverted/cubic";
	
	staticFunctions.SINE = "sine";
	staticFunctions.INVERTED_SINE = "inverted/sine";
	staticFunctions.NORMALIZED_COSINE = "normalizedCosine";
	
	staticFunctions.DYNAMIC_EXPONENTIAL = "exponential";
	staticFunctions.DYNAMIC_INVERTED = "inverted";
	
});