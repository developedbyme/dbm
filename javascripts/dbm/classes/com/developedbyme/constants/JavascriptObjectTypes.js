dbm.registerClass("com.developedbyme.constants.JavascriptObjectTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.JavascriptObjectTypes");
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.TYPE_UNDEFINED = "undefined";
	//MENOTE: null has type "object"
	//MENOTE: array has type "object"
	staticFunctions.TYPE_OBJECT = "object";
	staticFunctions.TYPE_BOOLEAN = "boolean";
	staticFunctions.TYPE_NUMBER = "number";
	staticFunctions.TYPE_STRING = "string";
	staticFunctions.TYPE_FUNCTION = "function";
	staticFunctions.TYPE_XML = "xml";
	
});


