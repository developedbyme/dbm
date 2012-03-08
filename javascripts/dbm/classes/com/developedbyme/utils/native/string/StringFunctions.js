dbm.registerClass("com.developedbyme.utils.native.string.StringFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringFunctions");
	//"use strict";
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
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
});
