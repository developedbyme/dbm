dbm.registerClass("com.developedbyme.nodejs.constants.ServerStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.ServerStatusTypes");
	//"use strict";
	
	var ServerStatusTypes = dbm.importClass("com.developedbyme.nodejs.constants.ServerStatusTypes");
	
	staticFunctions.STOPPED = 0;
	staticFunctions.STARTING = 2;
	staticFunctions.RUNNING = 1;
});