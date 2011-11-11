dbm.registerClass("com.developedbyme.utils.native.string.StringRegularExpressions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.native.string.StringRegularExpressions");
	
	var StringRegularExpressions = dbm.importClass("com.developedbyme.utils.native.string.StringRegularExpressions");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.IS_SCREAMING_CAPS = new RegExp("^[A-Z0-9_]*$", "");
	
	staticFunctions.isScreamingCaps = function(aText) {
		return ClassReference.IS_SCREAMING_CAPS.test(aText);
	};
});
