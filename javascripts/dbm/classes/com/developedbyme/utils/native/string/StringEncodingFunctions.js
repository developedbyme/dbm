/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.string.StringEncodingFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringEncodingFunctions");
	//"use strict";
	
	var StringEncodingFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringEncodingFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.RFC_3986_EXTRA_ENCODING_CHARACTERS = ["!", "'", "(", ")", "*"];
	staticFunctions.RFC_3986_EXTRA_ENCODING_CHARACTER_VALUES = ["%21", "%27", "%28", "%29", "%2A"];
	
	staticFunctions.encodeRfc3986 = function(aString) {
		var returnString = encodeURIComponent(aString);
		
		var currentArray = ClassReference.RFC_3986_EXTRA_ENCODING_CHARACTERS;
		var valuesArray = ClassReference.RFC_3986_EXTRA_ENCODING_CHARACTER_VALUES;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			returnString = returnString.split(currentArray[i]).join(valuesArray[i]);
		}
		
		return returnString;
	};
});
