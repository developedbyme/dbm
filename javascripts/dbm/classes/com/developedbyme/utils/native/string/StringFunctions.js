/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.native.string.StringFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringFunctions");
	//"use strict";
	
	//Self reference
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	//Error report
	
	//Dependnecies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.leftTrim = function(aText) {
		return aText.replace(new RegExp("^[\\s]+", "g"), "");
	};
	
	staticFunctions.rightTrim = function(aText) {
		return aText.replace(new RegExp("[\\s]+$", "g"), "");
	};
	
	staticFunctions.trim = function(aText) {
		return StringFunctions.leftTrim(StringFunctions.rightTrim(aText));
	};
	
	staticFunctions.splitSeparatedString = function(aText, aSeparator, aTrimLeft, aTrimRight) {
		
		aSeparator = VariableAliases.valueWithDefault(aSeparator, ",");
		aTrimLeft = VariableAliases.valueWithDefault(aTrimLeft, true);
		aTrimRight = VariableAliases.valueWithDefault(aTrimRight, true);
		
		var currentArray = aText.split(aSeparator);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentText = currentArray[i];
			if(aTrimLeft) {
				currentText = ClassReference.leftTrim(currentText);
			}
			if(aTrimRight) {
				currentText = ClassReference.rightTrim(currentText);
			}
			currentArray[i] = currentText;
		}
		
		return currentArray;
	};
	
	staticFunctions.splitToCharCodes = function(aString) {
		var returnArray = new Array();
		ClassReference.getCharCodes(aString, returnArray);
		
		return returnArray;
	};
	
	staticFunctions.getCharCodes = function(aString, aReturnArray) {
		//console.log("com.developedbyme.utils.native.string.StringFunctions::getCharCodes");
		//console.log(aString, aReturnArray);
		var currentArray = aReturnArray;
		var currentArrayLength = aString.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray.push(aString.charCodeAt(i));
		}
	};
	
	staticFunctions.convertToCamelCase = function(aText) {
		
		var currentArray = aText.split(" ");
		var currentArrayLength = currentArray.length;
		var returnText = currentArray[0].toLowerCase();
		for(var i = 1; i < currentArrayLength; i++) { //MENOTE: first iteration is done outside of loop
			var currentString = currentArray[i].toLowerCase();
			if(currentString.length > 0) {
				returnText += currentString[0].toUpperCase() + currentString.substring(1, currentString.length);
			}
		}
		
		return returnText;
	};
});
