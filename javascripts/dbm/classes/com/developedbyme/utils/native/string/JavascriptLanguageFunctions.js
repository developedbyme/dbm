/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	//"use strict";
	
	//Self reference
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var RegExpFunctions = dbm.importClass("com.developedbyme.utils.native.regexp.RegExpFunctions");
	
	//Constants
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	
	staticFunctions.KEWWORD_REG_EXPS = [
		new RegExp("^if[\\s]*\\("),
		new RegExp("^else[\\s]+if[\\s]*\\("),
		new RegExp("^else[\\s\\{]"),
		new RegExp("^for[\\s]*\\("),
		new RegExp("^while[\\s]*\\("),
		new RegExp("^var[\\s]+"),
		new RegExp("^function([\\s]+[a-zA-Z0-9_]*[\\s]*)?\\("),
		new RegExp("^break[\\s;]*"),
		new RegExp("^const[\\s]+"),
		new RegExp("^continue[\\s;]*"),
		new RegExp("^delete[\\s]+"),
		new RegExp("^do[\\s]*\\{"),
		new RegExp("^new[\\s]+"),
		new RegExp("^return([\\s]+.*)?$"),
		new RegExp("^switch[\\s]*\\("),
		new RegExp("^throw[\\s]*\\("),
		new RegExp("^try[\\s]*\\{"),
		new RegExp("^catch[\\s]*\\("),
		new RegExp("^finally[\\s]*\\{"),
		new RegExp("^with[\\s]*\\{"),
		new RegExp("^case[\\s]+[^:]*:"),
		new RegExp("^default[\\s]*:")
		
		/*
		new RegExp("^this[\\s]*"),
		
		new RegExp("^export[\\s]*"),
		new RegExp("^import[\\s]*"),
		new RegExp("^instanceOf[\\s]*"),
		new RegExp("^in[\\s]*"),
		new RegExp("^label[\\s]*"),
		new RegExp("^let[\\s]*"),
		new RegExp("^typeof[\\s]*"),
		new RegExp("^void[\\s]*"),
		new RegExp("^yield[\\s]*"),
		*/
	];
	
	staticFunctions.KEWWORD_REG_EXP_NAMES = [
		"if",
		"else if",
		"else",
		"for",
		"while",
		"var",
		"function",
		"break",
		"const",
		"continue",
		"delete",
		"do",
		"new",
		"return",
		"switch",
		"throw",
		"try",
		"catch",
		"finally",
		"with",
		"case",
		"default"
	];
	
	staticFunctions.GLOBAL_OBJECTS = [
		"ActiveXObject",
		"arguments",
		"Array",
		"ArrayBuffer",
		"Boolean",
		"clearInterval",
		"console",
		"Date",
		"decodeURI",
		"decodeURIComponent",
		"document",
		"DOMParser",
		"encodeURI",
		"encodeURIComponent",
		"Error",
		"eval",
		"EvalError",
		"false",
		"Float32Array",
		"Float64Array",
		"FileReader",
		"Function",
		"Image",
		"Infinity",
		"Int16Array",
		"Int32Array",
		"Int8Array",
		"isFinite",
		"isNaN",
		"Iterator",
		"JSON",
		"Math",
		"NaN",
		"navigator",
		"null",
		"Number",
		"Object",
		"parseFloat",
		"parseInt",
		"RangeError",
		"ReferenceError",
		"RegExp",
		"setInterval",
		"setTimeout",
		"StopIteration",
		"String",
		"SyntaxError",
		"this",
		"true",
		"TypeError",
		"typeof",
		"Uint16Array",
		"Uint32Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"undefined",
		"uneval",
		"URIError",
		"XMLHttpRequest",
		"XMLSerializer",
		"window"
	];
	
	staticFunctions.startsWithKeyword = function(aText) {
		return RegExpFunctions.matchTextInRegExpArrayWithNames(aText, ClassReference.KEWWORD_REG_EXPS, ClassReference.KEWWORD_REG_EXP_NAMES);
	};
	
	staticFunctions.startsWithSpecifiedKeyword = function(aText, aKeyword) {
		
		var currentIndex = ArrayFunctions.indexOfInArray(ClassReference.KEWWORD_REG_EXP_NAMES, aKeyword);
		
		if(currentIndex === -1) {
			return false;
		}
		
		return aText.match(ClassReference.KEWWORD_REG_EXPS[currentIndex]);
	};
	
	staticFunctions.isTypeNative = function(aType) {
		switch(aType.toLowerCase()) {
			case JavascriptObjectTypes.TYPE_OBJECT:
			case JavascriptObjectTypes.TYPE_BOOLEAN:
			case JavascriptObjectTypes.TYPE_NUMBER:
			case JavascriptObjectTypes.TYPE_STRING:
			case JavascriptObjectTypes.TYPE_FUNCTION:
			case JavascriptObjectTypes.TYPE_XML:
			case JavascriptObjectTypes.NON_REAL_TYPE_ARRAY:
			case JavascriptObjectTypes.NON_REAL_TYPE_ANY:
				return true;
		}
		return false;
	};
});