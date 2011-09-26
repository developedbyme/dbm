dbm.registerClass("com.developedbyme.constants.extendedevents.WindowExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.WindowExtendedEventIds");
	
	var WindowExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.WindowExtendedEventIds");
	
	staticFunctions.OPEN = "open";
	staticFunctions.CLOSE = "close";
	
	staticFunctions.RESIZE = "resize";
	staticFunctions.MOVE = "move";
	
	staticFunctions.FOCUS = "focus";
	staticFunctions.BLUR = "blur";
	
	staticFunctions.DOCUMENT_LOADED = "documentLoaded";
	staticFunctions.DOCUMENT_UNLOADED = "documentUnloaded";
	
});