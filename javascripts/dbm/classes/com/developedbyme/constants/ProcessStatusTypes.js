dbm.registerClass("com.developedbyme.constants.ProcessStatusTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ProcessStatusTypes");
	
	var ProcessStatusTypes = dbm.importClass("com.developedbyme.constants.ProcessStatusTypes");
	
	staticFunctions.NOT_STARTED = 0;
	staticFunctions.DONE = 1;
	staticFunctions.STARTED = 2;
	staticFunctions.ERROR = -1;
	
	staticFunctions.NOT_STARTED_NAME = "notStarted";
	staticFunctions.DONE_NAME = "done";
	staticFunctions.STARTED_NAME = "started";
	staticFunctions.ERROR_NAME = "error";
	staticFunctions.UNKNOWN_NAME = "unknown";
	
	staticFunctions.getStatusName = function(aStatus) {
		switch(aStatus) {
			case ClassReference.NOT_STARTED:
				return ClassReference.NOT_STARTED_NAME;
			case ClassReference.DONE:
				return ClassReference.DONE_NAME;
			case ClassReference.STARTED:
				return ClassReference.STARTED_NAME;
			case ClassReference.ERROR:
				return ClassReference.ERROR_NAME;
		}
		
		//METODO: error message
		return ClassReference.UNKNOWN_NAME;
	};
});