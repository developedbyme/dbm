/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.LoadingExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	staticFunctions.LOADED = "loaded";
	staticFunctions.LOADING_ERROR = "loadingError";
	staticFunctions.REQUEST_MORE_LOADERS = "requestMoreLoaders";
	
	staticFunctions.SAVED = "saved";
	staticFunctions.SAVING_ERROR = "savingError";
	
});