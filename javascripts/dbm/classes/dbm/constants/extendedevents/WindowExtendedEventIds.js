/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.WindowExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.WindowExtendedEventIds");
	
	var WindowExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.WindowExtendedEventIds");
	
	staticFunctions.OPEN = "open";
	staticFunctions.CLOSE = "close";
	
	staticFunctions.RESIZE = "resize";
	staticFunctions.MOVE = "move";
	
	staticFunctions.FOCUS = "focus";
	staticFunctions.BLUR = "blur";
	
	staticFunctions.DOCUMENT_READY = "documentReady";
	staticFunctions.DOCUMENT_LOADED = "documentLoaded";
	staticFunctions.DOCUMENT_UNLOADED = "documentUnloaded";
	
});