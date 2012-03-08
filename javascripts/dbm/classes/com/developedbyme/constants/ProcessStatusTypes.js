dbm.registerClass("com.developedbyme.constants.ProcessStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.ProcessStatusTypes");
	
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	
	staticFunctions.NOT_STARTED = 0;
	staticFunctions.DONE = 1;
	staticFunctions.STARTED = 2;
	staticFunctions.ERROR = -1;
	
});