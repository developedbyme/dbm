/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.number.NumberFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.number.NumberFunctions");
	
	//Self reference
	var NumberFunctions = dbm.importClass("dbm.utils.native.number.NumberFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	staticFunctions.getPaddedNumber = function(aNumber, aPadding) {
		var returnString = String(aNumber);
		for(var i = returnString.length; i < aPadding; i++) {
			returnString = "0" + returnString;
		}
		return returnString;
	};
	
	staticFunctions.roundToNumberOfDecimals = function(aNumber, aNumberOfDecimals) {
		var multiplicationValue = Math.pow(10, aNumberOfDecimals);
		return Math.round(multiplicationValue*aNumber)/multiplicationValue;
	};
	
	staticFunctions.floatModulus = function(aValue, aModulus) {
		var times = Math.floor(aValue/aModulus);
		return aValue-times*aModulus;
	};
	
	staticFunctions.getBitsRequiredForValue = function(aValue) {
		var debugCounter = 0;
		var length = 0;
		while(aValue >= Math.pow(2, length)) {
			length++;
		}
		return length;
	};
});
