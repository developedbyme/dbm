dbm.registerClass("com.developedbyme.utils.native.string.StringFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringFunctions");
	
	var StringFunctions = dbm.importClass("com.developedbyme.utils.native.string.StringFunctions");
	
	staticFunctions.leftTrim = function(aText) {
		return aText.replace(new RegExp("^[\\s]+", "g"), "");
	};
	
	staticFunctions.rightTrim = function(aText) {
		return aText.replace(new RegExp("[\\s]+$", "g"), "");
	};
	
	staticFunctions.trim = function(aText) {
		return StringFunctions.leftTrim(StringFunctions.rightTrim(aText));
	};
});
