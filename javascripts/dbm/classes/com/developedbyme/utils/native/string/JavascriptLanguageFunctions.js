dbm.registerClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	var JavascriptLanguageFunctions = dbm.importClass("com.developedbyme.utils.native.string.JavascriptLanguageFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	staticFunctions.KEWWORD_REG_EXPS = [
		new RegExp("^if[\\s]*\\("),
		new RegExp("^else[\\s]+if[\\s]*\\("),
		new RegExp("^else[\\s\\{]"),
		new RegExp("^for[\\s]*\\("),
		new RegExp("^while[\\s]*\\("),
		new RegExp("^var[\\s]+"),
		new RegExp("^function([\\s]+[a-zA-Z0-9]*[\\s]*)?\\("),
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
		new RegExp("^catch[\\s]*\\{"),
		new RegExp("^with[\\s]*\\{"),
		new RegExp("^case[\\s]+[^:]*:")
		
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
		"with",
		"case"
	];
	
	staticFunctions.startsWithKeyword = function(aText) {
		var currentArray = ClassReference.KEWWORD_REG_EXPS;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aText.match(currentArray[i])) {
				return ClassReference.KEWWORD_REG_EXP_NAMES[i];
			}
		}
		return null;
	};
	
	staticFunctions.startsWithSpecifiedKeyword = function(aText, aKeyword) {
		
		var currentIndex = ArrayFunctions.indexOfInArray(ClassReference.KEWWORD_REG_EXP_NAMES, aKeyword);
		
		if(currentIndex == -1) {
			return false;
		}
		
		return aText.match(ClassReference.KEWWORD_REG_EXPS[currentIndex]);
	};
});