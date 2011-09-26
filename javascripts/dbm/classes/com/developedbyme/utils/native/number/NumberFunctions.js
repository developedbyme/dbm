dbm.registerClass("com.developedbyme.utils.native.number.NumberFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.number.NumberFunctions");
	
	var NumberFunctions = dbm.importClass("com.developedbyme.utils.native.number.NumberFunctions");
	
	staticFunctions.getPaddedNumber = function(aNumber, aPadding) {
		var returnString = String(aNumber);
		for(var i = returnString.length; i < aPadding; i++) {
			returnString = "0" + returnString;
		}
		return returnString;
	};
	
	staticFunctions.roundToNumberOfDecimals = function(aNumber, aNumberOfDecimals) {
		var multiplicationValue = Math.pow(10, aNumberOfDecimals);
		return Math.round(multiplicationValue*aNumber)/multiplicationValue
	};
});


