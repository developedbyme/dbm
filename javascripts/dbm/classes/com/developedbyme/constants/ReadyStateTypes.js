dbm.registerClass("com.developedbyme.constants.ReadyStateTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ReadyStateTypes");
	
	var ReadyStateTypes = dbm.importClass("com.developedbyme.constants.ReadyStateTypes");
	
	staticFunctions.UNINIZIALIZED = 0;
	staticFunctions.SET_UP = 1;
	staticFunctions.SENT = 2;
	staticFunctions.PARTLY_DONE = 3;
	staticFunctions.DONE = 4;
	
	
});