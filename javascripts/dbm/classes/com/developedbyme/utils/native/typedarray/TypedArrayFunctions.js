/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var TypedArrayFunctions = dbm.importClass("com.developedbyme.utils.native.typedarray.TypedArrayFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.getWebGlFloatArray = function() {
		if(Float32Array !== undefined) {
			return Float32Array;
		}
		if(WebGLFloatArray !== undefined) {
			return WebGLFloatArray;
		}
		return Array;
	};
});