dbm.registerClass("com.developedbyme.utils.native.string.StringRegularExpressions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringRegularExpressions");
	//"use strict";
	
	var StringRegularExpressions = dbm.importClass("com.developedbyme.utils.native.string.StringRegularExpressions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.IS_SCREAMING_CAPS = new RegExp("^[A-Z0-9_]*$", "");
	staticFunctions.IS_WHITE_SPACE = new RegExp("^[\\s]*$", "");
	staticFunctions.IS_DIGIT = new RegExp("^[\\d]*$", "");
	staticFunctions.IS_HEXADECIMAL_DIGIT = new RegExp("^[\\da-fA-F]*$", "");
	
	staticFunctions.isScreamingCaps = function isScreamingCaps(aText) {
		return ClassReference.IS_SCREAMING_CAPS.test(aText);
	}; //End function isScreamingCaps
	
	staticFunctions.isWhiteSpace = function isWhiteSpace(aText) {
		return ClassReference.IS_WHITE_SPACE.test(aText);
	}; //End function isWhiteSpace
});
