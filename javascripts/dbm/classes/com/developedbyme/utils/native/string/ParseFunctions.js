dbm.registerClass("com.developedbyme.utils.native.string.ParseFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.ParseFunctions");
	//"use strict";
	
	var ParseFunctions = dbm.importClass("com.developedbyme.utils.native.string.ParseFunctions");
	
	var StringRegularExpressions = dbm.importClass("com.developedbyme.utils.native.string.StringRegularExpressions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	
	staticFunctions.getEndOfWhiteSpace = function(aString, aStartPosition) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var currentRegExp = StringRegularExpressions.IS_WHITE_SPACE;
		
		var theLength = aString.length;
		for(var i = aStartPosition; i < theLength; i++) {
			var currentChar = aString.charAt(i);
			if(!currentRegExp.test(currentChar)) {
				return i;
			}
		}
		return theLength;
	};
	
	staticFunctions.getEndOfSpacer = function(aString, aStartPosition, aSpacer) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var currentRegExp = new RegExp("^[\\s" + aSpacer + "]*$", "");
		
		var theLength = aString.length;
		for(var i = aStartPosition; i < theLength; i++) {
			var currentChar = aString.charAt(i);
			if(!currentRegExp.test(currentChar)) {
				return i;
			}
		}
		return theLength;
	};
	
	staticFunctions.getEndOfNumber = function(aString, aStartPosition) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var firstChar = aString.charAt(aStartPosition);
		if(firstChar == "#") {
			return ClassReference.getEndOfHexadecimalNumber(aString, aStartPosition+1);
		}
		else {
			if(firstChar == "0" && aString.charAt(aStartPosition+1) == "x") {
				return ClassReference.getEndOfHexadecimalNumber(aString, aStartPosition+1);
			}
			return ClassReference.getEndOfFloatNumber(aString, aStartPosition);
		}
	};
	
	staticFunctions.getEndOfHexadecimalNumber = function(aString, aStartPosition) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var currentRegExp = StringRegularExpressions.IS_HEXADECIMAL_DIGIT;
		
		var theLength = aString.length;
		for(var i = aStartPosition; i < theLength; i++) {
			var currentChar = aString.charAt(i);
			if(!currentRegExp.test(currentChar)) {
				return i;
			}
		}
		return theLength;
		
	};
	
	staticFunctions.getEndOfFloatNumber = function(aString, aStartPosition) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var currentPhase = 0;
		
		var currentRegExp = StringRegularExpressions.IS_DIGIT;
		
		var theLength = aString.length;
		for(var i = aStartPosition; i < theLength; i++) {
			var currentChar = aString.charAt(i);
			if(!currentRegExp.test(currentChar)) {
				if(currentPhase == 0 && currentChar == ".") {
					currentPhase = 1;
				}
				else if((currentPhase == 0 || currentPhase == 1) && (currentChar == "e" || currentChar == "E")) {
					currentPhase = 2;
					var nextChar = aString.charAt(i+1);
					if(nextChar == "+" || nextChar == "-") {
						i++;
					}
				}
				else {
					return i;
				}
			}
		}
		return theLength;
	};
	
	staticFunctions.getEndOfCssNumber = function(aString, aStartPosition) {
		
		aStartPosition = VariableAliases.valueWithDefault(aStartPosition, 0);
		
		var currentPhase = 0;
		
		var currentRegExp = StringRegularExpressions.IS_DIGIT;
		
		var theLength = aString.length;
		for(var i = aStartPosition; i < theLength; i++) {
			var currentChar = aString.charAt(i);
			if(!currentRegExp.test(currentChar)) {
				if(currentPhase == 0 && currentChar == ".") {
					currentPhase = 1;
				}
				else {
					return i;
				}
			}
		}
		return theLength;
	};
});