dbm.registerClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	//"use strict";
	
	var RoutedDataStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataStatusTypes");
	
	staticFunctions.UNKNOWN = "unknown";
	staticFunctions.UNHANDLED = "unhandled";
	staticFunctions.DONE = "done";
	staticFunctions.ERROR = "error";
	staticFunctions.UNHANDLED_EXCLUSIVE = "unhandledExclusive";
});