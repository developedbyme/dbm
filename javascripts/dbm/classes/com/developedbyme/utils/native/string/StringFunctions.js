/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions to manipulate strings.
 */
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
	
	
	/**
	 * Trims all the white space on the left side of a string.
	 *
	 * @param	aText	String	The text to trim.
	 *
	 * @return	String	The trimmed text.
	 */
	staticFunctions.leftTrim = function(aText) {
		return aText.replace(new RegExp("^[\\s]+", "g"), "");
	};
	
	/**
	 * Trims all the white space on the right side of a string.
	 *
	 * @param	aText	String	The text to trim.
	 *
	 * @return	String	The trimmed text.
	 */
	staticFunctions.rightTrim = function(aText) {
		return aText.replace(new RegExp("[\\s]+$", "g"), "");
	};
	
	/**
	 * Trims all the white space on both sides of a string.
	 *
	 * @param	aText	String	The text to trim.
	 *
	 * @return	String	The trimmed text.
	 */
	staticFunctions.trim = function(aText) {
		return StringFunctions.leftTrim(StringFunctions.rightTrim(aText));
	};
	
	/**
	 * Splits a separated string, with options to trim all the results
	 *
	 * @param	aText		String		The text to split up.
	 * @param	aSeparator	String		The string to split on. (Optional, default ",")
	 * @param	aTrimLeft	Boolean		If the resulting strings should be trimed on the left side. (Optional, default true)
	 * @param	aTrimRight	Boolean		If the resulting strings should be trimed on the right side. (Optional, default true)
	 *
	 * @return	Array<String>	The splitted string.
	 */
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
	
	/**
	 * Splits a string into an array of char codes.
	 *
	 * @param	aString		String	The string to get the char codes from.
	 *
	 * @return	Array<Number>	The array containing all the char codes.
	 */
	staticFunctions.splitToCharCodes = function(aString) {
		var returnArray = new Array();
		ClassReference.getCharCodes(aString, returnArray);
		
		return returnArray;
	};
	
	/**
	 * Gets all the char codes from a string.
	 *
	 * @param	aString			String	The string to get the char codes from.
	 * @param	aReturnArray	Array	The array that gets filled with the charcodes.
	 */
	staticFunctions.getCharCodes = function(aString, aReturnArray) {
		//console.log("com.developedbyme.utils.native.string.StringFunctions::getCharCodes");
		//console.log(aString, aReturnArray);
		var currentArray = aReturnArray;
		var currentArrayLength = aString.length;
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray.push(aString.charCodeAt(i));
		}
	};
	
	/**
	 * Converts a text to camel case (eg. This is an example text -> thisIsAnExampleText).
	 *
	 * @param	aText	String	The text to convert.
	 *
	 * @return	String	The converted text.
	 */
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
	
	/**
	 * Converts a string to a safe file name.
	 *
	 * @param	aText	String	The text to convert.
	 *
	 * @return	String	The converted text.
	 */
	staticFunctions.convertToSafeFileName = function(aText) {
		return aText.replace(new RegExp("[^A-Za-z0-9\\-_\\.\\~]+", "g"), "-");
	};
});
