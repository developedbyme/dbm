dbm.registerClass("com.developedbyme.constants.DataParserTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.DataParserTypes");
	
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	//Basic
	staticFunctions.STRING = "string";
	staticFunctions.FLOAT = "float";
	staticFunctions.NUMBER = "number";
	
	//Text
	staticFunctions.UPPER_CASE_TEXT = "upperCaseText";
	staticFunctions.LOWER_CASE_TEXT = "lowerCaseText";
	staticFunctions.TEXT_REPLACEMENT = "textReplacement";
	
	//Complex
	staticFunctions.KEY_VALUE = "keyValue";
	
	//Object
	staticFunctions.STRING_ALIASES = "stringAliases";
});