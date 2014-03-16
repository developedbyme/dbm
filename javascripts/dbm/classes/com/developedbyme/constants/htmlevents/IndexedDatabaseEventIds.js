/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.htmlevents.IndexedDatabaseEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.htmlevents.IndexedDatabaseEventIds");
	
	var IndexedDatabaseEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.IndexedDatabaseEventIds");
	
	//Open
	staticFunctions.BLOCKED = "blocked";
	staticFunctions.UPGRADE_NEEDED = "upgradeneeded";
	
	//Database, transaction, request
	staticFunctions.ABORT = "abort";
	staticFunctions.ERROR = "error";
	
	//Database
	staticFunctions.VERSION_CHANGE = "versionchange";
	
	//Transaction
	staticFunctions.COMPLETE = "complete";
	
	//Request
	staticFunctions.SUCCESS = "success";
});

