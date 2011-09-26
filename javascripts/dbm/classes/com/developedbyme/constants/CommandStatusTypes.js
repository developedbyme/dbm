dbm.registerClass("com.developedbyme.constants.CommandStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.CommandStatusTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	staticFunctions.CONTINUE = 1;
	staticFunctions.BREAK = 0;
	staticFunctions.ERROR = -1;
	
});